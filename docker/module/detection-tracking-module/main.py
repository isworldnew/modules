import os
import uuid
import threading

import cv2
from flask import Flask, request, jsonify
from ultralytics import YOLO
from pymongo import MongoClient

# =========================
# CONFIG
# =========================

UPLOAD_DIR = "/app/uploads"
MODEL_PATH = "./models/yolov8n.pt"

MONGO_URI="mongodb://ivan-student:ivan-student@track-storage:27017/?authSource=admin"
DB_NAME = "track-storage"
COLLECTION_NAME = "detected-persons"

FRAME_SKIP = 3
IMGSZ = 640
MAX_MISSING_SEC = 1.0
MIN_PERSON_DURATION = 2.0
SAVE_EVERY_SEC = 0.5

# =========================
# INIT
# =========================

os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024 * 1024  # 10GB

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

model = YOLO(MODEL_PATH)

# =========================
# HELPERS
# =========================

def save_stream(file, path):
    with open(path, "wb") as f:
        while True:
            chunk = file.stream.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)


# =========================
# TRACKING LOGIC
# =========================

def process_video(video_path, original_filename):
    print(f"[START] {video_path}")

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()

    active = {}
    finished = []
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
                    "video": original_filename,
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

        # close tracks
        to_delete = []

        for pid, p in active.items():
            if time_sec - p["last_seen"] > MAX_MISSING_SEC:

                duration = p["end_time"] - p["start_time"]

                if duration >= MIN_PERSON_DURATION:
                    finished.append(p)

                to_delete.append(pid)

        for pid in to_delete:
            del active[pid]

        frame_id += 1

    # flush
    for pid, p in active.items():
        duration = p["end_time"] - p["start_time"]
        if duration >= MIN_PERSON_DURATION:
            finished.append(p)

    # =========================
    # SAVE TO MONGO
    # =========================

    inserted_ids = []

    for person in finished:
        result = collection.insert_one(person)
        inserted_ids.append(str(result.inserted_id))

    print(f"[DONE] {video_path} → {len(inserted_ids)} persons saved")

    # =========================
    # CLEANUP
    # =========================

    os.remove(video_path)


# =========================
# API
# =========================

@app.route("/detect/next", methods=["POST"])
def detect_next():

    if "file" not in request.files:
        return jsonify({"message": "No file"}), 400

    file = request.files["file"]

    if not file.filename.lower().endswith(".mp4"):
        return jsonify({"message": "Only .mp4 allowed"}), 400

    video_id = str(uuid.uuid4())
    filename = f"{video_id}.mp4"
    path = os.path.join(UPLOAD_DIR, filename)

    save_stream(file, path)

    # async processing
    threading.Thread(
        target=process_video,
        args=(path, file.filename),
        daemon=True
    ).start()

    return jsonify({
        "message": "accepted",
        "video_id": video_id
    }), 200


# =========================
# RUN
# =========================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)