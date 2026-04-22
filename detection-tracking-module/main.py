import cv2
import json
import os
from pathlib import Path
from ultralytics import YOLO

# =========================
# CONFIG
# =========================

VIDEO_PATH = os.path.abspath("./videos/example.mp4")
OUTPUT_JSON = os.path.abspath("./jsons/output.json")
CROPS_DIR = os.path.abspath("./crops")

MODEL_PATH = os.path.abspath("./models/yolov8n.pt")

FRAME_SKIP = 3                # 🔥 ключевая оптимизация
IMGSZ = 640

MAX_MISSING_SEC = 1.0         # вместо frame-based логики
MIN_PERSON_DURATION = 2.0

SAVE_EVERY_SEC = 1.0
MAX_CROPS_PER_PERSON = 30

os.makedirs(CROPS_DIR, exist_ok=True)


# =========================
# LOAD VIDEO INFO
# =========================

cap = cv2.VideoCapture(VIDEO_PATH)
fps = cap.get(cv2.CAP_PROP_FPS)
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
cap.release()

print(f"FPS: {fps}, frames: {frame_count}")


# =========================
# LOAD MODEL
# =========================

model = YOLO(MODEL_PATH)


# =========================
# TRACKING STATE
# =========================

active = {}
finished = []

frame_id = 0


# =========================
# MAIN LOOP
# =========================

results = model.track(
    source=VIDEO_PATH,
    stream=True,
    persist=True,
    classes=[0],
    imgsz=IMGSZ,
    verbose=False,
    tracker="bytetrack.yaml"
)

print("Processing...")

for r in results:

    # frame skipping (главный ускоритель)
    if frame_id % FRAME_SKIP != 0:
        frame_id += 1
        continue

    time_sec = frame_id / fps

    if r.boxes is None:
        frame_id += 1
        continue

    current_ids = set()

    frame = r.orig_img  # оригинальный кадр

    for box in r.boxes:

        if box.id is None:
            continue

        pid = int(box.id)

        x1, y1, x2, y2 = map(int, box.xyxy[0])

        w, h = x2 - x1, y2 - y1
        cx, cy = x1 + w / 2, y1 + h / 2

        current_ids.add(pid)

        # NEW PERSON
        if pid not in active:
            active[pid] = {
                "person_id": pid,
                "start_time": time_sec,
                "end_time": time_sec,
                "last_seen": time_sec,
                "track": [],
                "crops_saved": 0
            }

        person = active[pid]

        person["end_time"] = time_sec
        person["last_seen"] = time_sec

        # SAVE TRACK POINTS (1x per second)
        if len(person["track"]) == 0 or time_sec - person["track"][-1]["time"] >= SAVE_EVERY_SEC:

            person["track"].append({
                "time": round(time_sec, 2),
                "cx": round(cx, 1),
                "cy": round(cy, 1),
                "w": w,
                "h": h
            })

        # SAVE CROPS (for CNN dataset)
        if person["crops_saved"] < MAX_CROPS_PER_PERSON:

            crop = frame[y1:y2, x1:x2]

            if crop.size > 0:
                crop_path = os.path.join(
                    CROPS_DIR,
                    f"person_{pid}_{person['crops_saved']}.jpg"
                )

                cv2.imwrite(crop_path, crop)
                person["crops_saved"] += 1


    # =========================
    # CLOSE LOST TRACKS
    # =========================

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

    if frame_id % 300 == 0:
        print("Frames:", frame_id)


# =========================
# FLUSH ACTIVE
# =========================

for pid, p in active.items():

    duration = p["end_time"] - p["start_time"]

    if duration >= MIN_PERSON_DURATION:
        finished.append(p)


# =========================
# CLEAN OUTPUT
# =========================

output = {
    "video": VIDEO_PATH,
    "fps": fps,
    "people_count": len(finished),
    "people": finished
}

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=4, ensure_ascii=False)

print("DONE")
print("People:", len(finished))
print("JSON:", OUTPUT_JSON)
print("Crops dir:", CROPS_DIR)