"""
TODO: добавить /config/config.json с максимальным количеством воркеров

И сделать пул моделей YOLO такого же размера. Можно взять модель и попользоваться ею, после чего вернуть.

Если все воркеры заняты - не принимать запросы.
"""

import os
import uuid
import threading

import cv2
import numpy as np

from flask import Flask, request, jsonify
from ultralytics import YOLO
from pymongo import MongoClient
from minio import Minio
from bson import ObjectId

from kafka_producer import send_detection_message, init_detection_producer, close_detection_producer


UPLOAD_DIR = "/app/uploads"
MODEL_PATH = "./models/yolov8n.pt"

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "track-storage"
COLLECTION_NAME = "detected-persons"

MINIO_ENDPOINT = "crop-storage:9000"
MINIO_ACCESS_KEY = os.getenv("MINIO_ROOT_USER", "ivan-student")
MINIO_SECRET_KEY = os.getenv("MINIO_ROOT_PASSWORD", "ivan-student")
MINIO_BUCKET = "crops"

FRAME_SKIP = 3
IMGSZ = 640
MAX_MISSING_SEC = 1.0
MIN_PERSON_DURATION = 2.0
SAVE_EVERY_SEC = 0.5

MAX_CROPS = 30


os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024 * 1024  # 10GB

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)


def save_stream(file, path):
    with open(path, "wb") as f:
        while True:
            chunk = file.stream.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)


def upload_crop_to_minio(image, object_name):
    success, buffer = cv2.imencode(".jpg", image)
    if not success:
        return

    data = buffer.tobytes()

    minio_client.put_object(
        MINIO_BUCKET,
        object_name,
        data=bytes_to_stream(data),
        length=len(data),
        content_type="image/jpeg"
    )


def bytes_to_stream(data: bytes):
    from io import BytesIO
    return BytesIO(data)


def crop_person(video_path, person, object_id):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    track = person["track"]

    if len(track) == 0:
        cap.release()
        return 0

    if len(track) <= MAX_CROPS:
        selected = track
    else:
        cut = int(len(track) * 0.2)
        trimmed = track[cut:len(track)-cut] if len(track) > 5 else track

        if len(trimmed) == 0:
            trimmed = track

        step = len(trimmed) / MAX_CROPS

        selected = []
        for i in range(MAX_CROPS):
            idx = int(i * step)
            if idx < len(trimmed):
                selected.append(trimmed[idx])

    def get_frame(fid):
        cap.set(cv2.CAP_PROP_POS_FRAMES, fid)
        ret, frame = cap.read()
        return frame if ret else None

    saved = 0

    for i, t in enumerate(selected):

        frame_id = int(t["time"] * fps)

        cx, cy = t["cx"], t["cy"]
        w, h = t["w"], t["h"]

        if w * h < 1500:
            continue

        x1 = int(cx - w / 2)
        y1 = int(cy - h / 2)
        x2 = int(cx + w / 2)
        y2 = int(cy + h / 2)

        x1 = max(0, x1)
        y1 = max(0, y1)
        x2 = min(width, x2)
        y2 = min(height, y2)

        frame = get_frame(frame_id)
        if frame is None:
            continue

        crop = frame[y1:y2, x1:x2]
        if crop.size == 0:
            continue

        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        blur = cv2.Laplacian(gray, cv2.CV_64F).var()

        if blur < 50:
            continue

        object_name = f"{object_id}_{saved}.jpg"

        upload_crop_to_minio(crop, object_name)

        saved += 1

        if saved >= MAX_CROPS:
            break

    cap.release()
    return saved


def process_video(video_path, original_filename):
    model = YOLO(MODEL_PATH)
    print(f"[START] {video_path}")

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()

    active = {}
    frame_id = 0

    results = model.track(
        source=video_path,
        stream=True,
        persist=True,
        classes=[0],
        imgsz=IMGSZ,
        verbose=False,
        tracker="bytetrack.yaml"
    )

    for r in results:

        if frame_id % FRAME_SKIP != 0:
            frame_id += 1
            continue

        time_sec = frame_id / fps

        if r.boxes is None:
            frame_id += 1
            continue

        for box in r.boxes:

            if box.id is None:
                continue

            pid = int(box.id)

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            w, h = x2 - x1, y2 - y1
            cx, cy = x1 + w / 2, y1 + h / 2

            if pid not in active:
                active[pid] = {
                    "video": "records/" + original_filename,
                    "person_id": pid,
                    "start_time": time_sec,
                    "end_time": time_sec,
                    "last_seen": time_sec,
                    "track": []
                }

            p = active[pid]

            p["end_time"] = time_sec
            p["last_seen"] = time_sec

            if len(p["track"]) == 0 or time_sec - p["track"][-1]["time"] >= SAVE_EVERY_SEC:
                p["track"].append({
                    "time": round(time_sec, 2),
                    "cx": round(cx, 1),
                    "cy": round(cy, 1),
                    "w": w,
                    "h": h
                })

        to_delete = []

        for pid, p in active.items():
            if time_sec - p["last_seen"] > MAX_MISSING_SEC:

                duration = p["end_time"] - p["start_time"]

                if duration >= MIN_PERSON_DURATION:
                    # Сохраняем в MongoDB и отправляем сообщение сразу
                    result = collection.insert_one(p)
                    object_id = str(result.inserted_id)

                    saved = crop_person(video_path, p, object_id)

                    print(f"[CROPS] person {object_id}: {saved} saved")

                    send_detection_message(object_id, saved)

                to_delete.append(pid)

        for pid in to_delete:
            del active[pid]

        frame_id += 1

    # Обрабатываем оставшиеся активные треки в конце видео
    for pid, p in active.items():
        duration = p["end_time"] - p["start_time"]
        if duration >= MIN_PERSON_DURATION:
            # Сохраняем в MongoDB и отправляем сообщение сразу
            result = collection.insert_one(p)
            object_id = str(result.inserted_id)

            saved = crop_person(video_path, p, object_id)

            print(f"[CROPS] person {object_id}: {saved} saved")

            send_detection_message(object_id, saved)

    print(f"[DONE] {video_path} → processed all persons")

    os.remove(video_path)
    print(f"[DELETE] {video_path}")


from kafka_consumer import start_consumer
import threading

def start_kafka():
    t = threading.Thread(target=start_consumer, daemon=True)
    t.start()

init_detection_producer()
start_kafka()

import atexit

def cleanup():
    close_detection_producer()

atexit.register(cleanup)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    
# """
# TODO: добавить /config/config.json с максимальным количеством воркеров

# И сделать пул моделей YOLO такого же размера. Можно взять модель и попользоваться ею, после чего вернуть.

# Если все воркеры заняты - не принимать запросы.
# """

# import os
# import uuid
# import threading

# import cv2
# import numpy as np

# from flask import Flask, request, jsonify
# from ultralytics import YOLO
# from pymongo import MongoClient
# from minio import Minio
# from bson import ObjectId

# from kafka_producer import send_detection_message, init_detection_producer, close_detection_producer


# UPLOAD_DIR = "/app/uploads"
# MODEL_PATH = "./models/yolov8n.pt"

# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = "track-storage"
# COLLECTION_NAME = "detected-persons"

# MINIO_ENDPOINT = "crop-storage:9000"
# MINIO_ACCESS_KEY = os.getenv("MINIO_ROOT_USER", "ivan-student")
# MINIO_SECRET_KEY = os.getenv("MINIO_ROOT_PASSWORD", "ivan-student")
# MINIO_BUCKET = "crops"

# FRAME_SKIP = 3
# IMGSZ = 640
# MAX_MISSING_SEC = 1.0
# MIN_PERSON_DURATION = 2.0
# SAVE_EVERY_SEC = 0.5

# MAX_CROPS = 30


# os.makedirs(UPLOAD_DIR, exist_ok=True)

# app = Flask(__name__)
# app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024 * 1024  # 10GB

# client = MongoClient(MONGO_URI)
# db = client[DB_NAME]
# collection = db[COLLECTION_NAME]

# minio_client = Minio(
#     MINIO_ENDPOINT,
#     access_key=MINIO_ACCESS_KEY,
#     secret_key=MINIO_SECRET_KEY,
#     secure=False
# )


# def save_stream(file, path):
#     with open(path, "wb") as f:
#         while True:
#             chunk = file.stream.read(1024 * 1024)
#             if not chunk:
#                 break
#             f.write(chunk)


# def upload_crop_to_minio(image, object_name):
#     success, buffer = cv2.imencode(".jpg", image)
#     if not success:
#         return

#     data = buffer.tobytes()

#     minio_client.put_object(
#         MINIO_BUCKET,
#         object_name,
#         data=bytes_to_stream(data),
#         length=len(data),
#         content_type="image/jpeg"
#     )


# def bytes_to_stream(data: bytes):
#     from io import BytesIO
#     return BytesIO(data)



# def crop_person(video_path, person, object_id):
#     cap = cv2.VideoCapture(video_path)
#     fps = cap.get(cv2.CAP_PROP_FPS)

#     width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#     height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

#     track = person["track"]

#     if len(track) == 0:
#         cap.release()
#         return 0

#     if len(track) <= MAX_CROPS:
#         selected = track
#     else:
#         cut = int(len(track) * 0.2)
#         trimmed = track[cut:len(track)-cut] if len(track) > 5 else track

#         if len(trimmed) == 0:
#             trimmed = track

#         step = len(trimmed) / MAX_CROPS

#         selected = []
#         for i in range(MAX_CROPS):
#             idx = int(i * step)
#             if idx < len(trimmed):
#                 selected.append(trimmed[idx])

#     def get_frame(fid):
#         cap.set(cv2.CAP_PROP_POS_FRAMES, fid)
#         ret, frame = cap.read()
#         return frame if ret else None

#     saved = 0

#     for i, t in enumerate(selected):

#         frame_id = int(t["time"] * fps)

#         cx, cy = t["cx"], t["cy"]
#         w, h = t["w"], t["h"]

#         if w * h < 1500:
#             continue

#         x1 = int(cx - w / 2)
#         y1 = int(cy - h / 2)
#         x2 = int(cx + w / 2)
#         y2 = int(cy + h / 2)

#         x1 = max(0, x1)
#         y1 = max(0, y1)
#         x2 = min(width, x2)
#         y2 = min(height, y2)

#         frame = get_frame(frame_id)
#         if frame is None:
#             continue

#         crop = frame[y1:y2, x1:x2]
#         if crop.size == 0:
#             continue

#         gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
#         blur = cv2.Laplacian(gray, cv2.CV_64F).var()

#         if blur < 50:
#             continue

#         object_name = f"{object_id}_{saved}.jpg"

#         upload_crop_to_minio(crop, object_name)

#         saved += 1

#         if saved >= MAX_CROPS:
#             break

#     cap.release()
#     return saved



# def process_video(video_path, original_filename):
#     model = YOLO(MODEL_PATH)
#     print(f"[START] {video_path}")

#     cap = cv2.VideoCapture(video_path)
#     fps = cap.get(cv2.CAP_PROP_FPS)
#     cap.release()

#     active = {}
#     finished = []
#     frame_id = 0

#     results = model.track(
#         source=video_path,
#         stream=True,
#         persist=True,
#         classes=[0],
#         imgsz=IMGSZ,
#         verbose=False,
#         tracker="bytetrack.yaml"
#     )

#     for r in results:

#         if frame_id % FRAME_SKIP != 0:
#             frame_id += 1
#             continue

#         time_sec = frame_id / fps

#         if r.boxes is None:
#             frame_id += 1
#             continue

#         for box in r.boxes:

#             if box.id is None:
#                 continue

#             pid = int(box.id)

#             x1, y1, x2, y2 = map(int, box.xyxy[0])
#             w, h = x2 - x1, y2 - y1
#             cx, cy = x1 + w / 2, y1 + h / 2

#             if pid not in active:
#                 active[pid] = {
#                     "video": "records/" + original_filename,
#                     "person_id": pid,
#                     "start_time": time_sec,
#                     "end_time": time_sec,
#                     "last_seen": time_sec,
#                     "track": []
#                 }

#             p = active[pid]

#             p["end_time"] = time_sec
#             p["last_seen"] = time_sec

#             if len(p["track"]) == 0 or time_sec - p["track"][-1]["time"] >= SAVE_EVERY_SEC:
#                 p["track"].append({
#                     "time": round(time_sec, 2),
#                     "cx": round(cx, 1),
#                     "cy": round(cy, 1),
#                     "w": w,
#                     "h": h
#                 })

#         to_delete = []

#         for pid, p in active.items():
#             if time_sec - p["last_seen"] > MAX_MISSING_SEC:

#                 duration = p["end_time"] - p["start_time"]

#                 if duration >= MIN_PERSON_DURATION:
#                     finished.append(p)

#                 to_delete.append(pid)

#         for pid in to_delete:
#             del active[pid]

#         frame_id += 1

#     for pid, p in active.items():
#         duration = p["end_time"] - p["start_time"]
#         if duration >= MIN_PERSON_DURATION:
#             finished.append(p)


#     for person in finished:
#         result = collection.insert_one(person)
#         object_id = str(result.inserted_id)

#         saved = crop_person(video_path, person, object_id)

#         print(f"[CROPS] person {object_id}: {saved} saved")

#         send_detection_message(object_id, saved)

#     print(f"[DONE] {video_path} → {len(finished)} persons")

#     os.remove(video_path)
#     print(f"[DELETE] {video_path}")


# from kafka_consumer import start_consumer
# import threading

# def start_kafka():
#     t = threading.Thread(target=start_consumer, daemon=True)
#     t.start()

# init_detection_producer()
# start_kafka()

# import atexit

# def cleanup():
#     close_detection_producer()

# atexit.register(cleanup)


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)