import json
from concurrent.futures import ThreadPoolExecutor


with open("config/config.json", "r") as f:
    config = json.load(f)

MAX_WORKERS = config.get("max_workers", 4)

executor = ThreadPoolExecutor(
    max_workers=MAX_WORKERS,
    thread_name_prefix="video-worker"
)