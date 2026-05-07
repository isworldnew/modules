import os
import json
import threading
import logging
import time

from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KAFKA_SERVERS = os.getenv("DETECTION_BROKER_SERVERS", "detection-broker:9092")
KAFKA_TOPIC = os.getenv("DETECTION_TOPIC", "detected-persons")
KAFKA_GROUP_ID = os.getenv("KAFKA_GROUP_ID", "classification-group")

def handle_message(message):
    try:
        from app import process_classification_message
        import time as time_module
        
        payload = json.loads(message.value.decode("utf-8"))
        
        object_id = payload.get("object_id")
        crops_amount = payload.get("crops_amount")
        
        if not object_id or crops_amount is None:
            logger.warning(f"[KAFKA] Invalid message format: {payload}")
            return
        
        logger.info(f"[KAFKA] Received message: object_id={object_id}, crops={crops_amount}")
        
        thread = threading.Thread(
            target=process_classification_message,
            args=(object_id, crops_amount),
            daemon=True
        )
        thread.start()
        
    except Exception as e:
        logger.error(f"[KAFKA] Error handling message: {e}")

def start_consumer():
    attempt = 0
    
    while True:
        try:
            attempt += 1
            logger.info(f"[KAFKA] Attempting to connect to detection broker (attempt {attempt})")
            
            consumer = KafkaConsumer(
                KAFKA_TOPIC,
                bootstrap_servers=KAFKA_SERVERS.split(","),
                group_id=KAFKA_GROUP_ID,
                auto_offset_reset="earliest",
                enable_auto_commit=True,
                auto_commit_interval_ms=5000,
                request_timeout_ms=30000,
                metadata_max_age_ms=60000,
                max_poll_records=10  
            )
            
            logger.info("[KAFKA] Consumer started successfully")
            
            for message in consumer:
                handle_message(message)
            
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