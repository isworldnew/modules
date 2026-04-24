import os
import json
import threading
import logging

from kafka import KafkaConsumer
from minio import Minio

import time
from kafka.errors import NoBrokersAvailable

# from main import process_video, UPLOAD_DIR, save_stream

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KAFKA_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC")
KAFKA_GROUP_ID = os.getenv("KAFKA_GROUP_ID", "detection-tracking-group")

# MinIO (entry storage)
ENTRY_MINIO_ENDPOINT = os.getenv("ENTRY_MINIO_ENDPOINT")
ENTRY_MINIO_ACCESS_KEY = os.getenv("ENTRY_MINIO_ACCESS_KEY")
ENTRY_MINIO_SECRET_KEY = os.getenv("ENTRY_MINIO_SECRET_KEY")
ENTRY_BUCKET = os.getenv("ENTRY_MINIO_BUCKET", "records")

minio_client = Minio(
    ENTRY_MINIO_ENDPOINT,
    access_key=ENTRY_MINIO_ACCESS_KEY,
    secret_key=ENTRY_MINIO_SECRET_KEY,
    secure=False
)


# def download_video_from_minio(key: str, local_path: str) -> bool:
#     try:
#         obj = minio_client.get_object(ENTRY_BUCKET, key)
#         save_stream(obj, local_path)
#         obj.close()
#         obj.release_conn()
#         return True
#     except Exception as e:
#         logger.error(f"Video not found in MinIO: {key}, err={e}")
#         return False

def download_video_from_minio(key: str, local_path: str) -> bool:
    try:
        response = minio_client.get_object(ENTRY_BUCKET, key)

        with open(local_path, "wb") as f:
            for chunk in response.stream(32 * 1024):
                f.write(chunk)

        response.close()
        response.release_conn()
        return True

    except Exception as e:
        logger.error(f"Video not found in MinIO: {key}, err={e}")
        return False


def handle_message(message):
    try:
        from main import process_video, UPLOAD_DIR, save_stream
        payload = json.loads(message.value.decode("utf-8"))

        records = payload.get("Records", [])
        if not records:
            return

        obj = records[0].get("s3", {}).get("object", {})
        key = obj.get("key")

        if not key:
            return

        video_id = key.replace("/", "_")
        local_path = f"{UPLOAD_DIR}/{video_id}"

        logger.info(f"[KAFKA] processing {key}")

        ok = download_video_from_minio(key, local_path)
        if not ok:
            logger.warning(f"[KAFKA] file missing: {key}")
            return

        # запуск обработки
        threading.Thread(
            target=process_video,
            args=(local_path, key),
            daemon=True
        ).start()

    except Exception as e:
        logger.error(f"Kafka message handling error: {e}")


# def start_consumer():
#     consumer = KafkaConsumer(
#         KAFKA_TOPIC,
#         bootstrap_servers=KAFKA_SERVERS.split(","),
#         group_id=KAFKA_GROUP_ID,
#         auto_offset_reset="earliest",
#         enable_auto_commit=True
#     )

#     logger.info("[KAFKA] consumer started")

#     for message in consumer:
#         handle_message(message)

def start_consumer():
    attempt = 0
    
    while True:
        try:
            attempt += 1
            logger.info(f"[KAFKA] Attempting to connect to Kafka (attempt {attempt})")
            
            consumer = KafkaConsumer(
                KAFKA_TOPIC,
                bootstrap_servers=KAFKA_SERVERS.split(","),
                group_id=KAFKA_GROUP_ID,
                auto_offset_reset="earliest",
                enable_auto_commit=True,
                request_timeout_ms=30000,  # 30 seconds
                metadata_max_age_ms=60000   # 60 seconds
            )
            
            logger.info("[KAFKA] Consumer started successfully")
            
            # Обработка сообщений
            for message in consumer:
                handle_message(message)
            
            # Если цикл прервался (ошибка), продолжаем попытки
            logger.warning("[KAFKA] Consumer loop ended, reconnecting...")
            time.sleep(5)
            
        except NoBrokersAvailable as e:
            logger.warning(f"[KAFKA] No brokers available: {e}")
            logger.info("[KAFKA] Retrying in 5 seconds...")
            time.sleep(5)
            
        except Exception as e:
            logger.error(f"[KAFKA] Unexpected error: {e}")
            logger.info("[KAFKA] Retrying in 10 seconds...")
            time.sleep(10)