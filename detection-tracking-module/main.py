import cv2
import json
import os
from ultralytics import YOLO

# =========================
# CONFIG
# =========================

VIDEO_PATH = "./videos/example.mp4"
JSON_PATH = "./jsons/output.json"
CROPS_DIR = "./crops"

MODEL_PATH = "./models/yolov8n.pt"

# tracking
FRAME_SKIP = 3
IMGSZ = 640
MAX_MISSING_SEC = 1.0
MIN_PERSON_DURATION = 2.0
SAVE_EVERY_SEC = 0.5  # чаще сохраняем точки

# crops
MAX_CROPS = 30

os.makedirs(CROPS_DIR, exist_ok=True)


# =========================
# STAGE 1: TRACKING
# =========================

def run_tracking():
    print("Stage 1: tracking...")

    cap = cv2.VideoCapture(VIDEO_PATH)
    fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()

    model = YOLO(MODEL_PATH)

    active = {}
    finished = []
    frame_id = 0

    results = model.track(
        source=VIDEO_PATH,
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
                    "person_id": pid,
                    "start_time": time_sec,
                    "end_time": time_sec,
                    "last_seen": time_sec,
                    "track": []
                }

            p = active[pid]

            p["end_time"] = time_sec
            p["last_seen"] = time_sec

            # сохраняем точки раз в N секунд
            if len(p["track"]) == 0 or time_sec - p["track"][-1]["time"] >= SAVE_EVERY_SEC:
                p["track"].append({
                    "time": round(time_sec, 2),
                    "cx": round(cx, 1),
                    "cy": round(cy, 1),
                    "w": w,
                    "h": h
                })

        # закрытие треков
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

    output = {
        "video": VIDEO_PATH,
        "fps": fps,
        "people_count": len(finished),
        "people": finished
    }

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=4, ensure_ascii=False)

    print("Tracking done:", len(finished), "people")


# =========================
# STAGE 2: CROPPING
# =========================

def run_cropping():
    print("Stage 2: cropping...")

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    fps = data["fps"]

    cap = cv2.VideoCapture(VIDEO_PATH)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    def get_frame(frame_id):
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_id)
        ret, frame = cap.read()
        return frame if ret else None

    for person in data["people"]:

        pid = person["person_id"]
        track = person["track"]

        if len(track) == 0:
            continue

        # =========================
        # ВЫБОР КАДРОВ (середина + равномерно)
        # =========================

        if len(track) <= MAX_CROPS:
            selected_track = track
        else:
            # убираем начало и конец
            cut = int(len(track) * 0.2)

            trimmed = track[cut:len(track)-cut] if len(track) > 5 else track

            if len(trimmed) == 0:
                trimmed = track

            step = len(trimmed) / MAX_CROPS

            selected_track = []
            for i in range(MAX_CROPS):
                idx = int(i * step)
                if idx < len(trimmed):
                    selected_track.append(trimmed[idx])

        # =========================
        # CROPPING
        # =========================

        saved = 0

        for i, t in enumerate(selected_track):

            frame_id = int(t["time"] * fps)

            cx, cy = t["cx"], t["cy"]
            w, h = t["w"], t["h"]

            # фильтр слишком маленьких bbox
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

            # фильтр размытия
            gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            blur = cv2.Laplacian(gray, cv2.CV_64F).var()

            if blur < 50:
                continue

            path = os.path.join(CROPS_DIR, f"person_{pid}_{saved}.jpg")
            cv2.imwrite(path, crop)

            saved += 1

            if saved >= MAX_CROPS:
                break

        print(f"person {pid}: saved {saved} crops")

    cap.release()
    print("Cropping done")


# =========================
# MAIN
# =========================

if not os.path.exists(JSON_PATH):
    run_tracking()
else:
    print("JSON exists → skipping tracking")

run_cropping()