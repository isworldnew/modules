from fastapi import FastAPI, Request
import json
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
import os
import logging
import time
from kafka_config import ensure_topic_exists

app = FastAPI()

KAFKA_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "record-storage-broker:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "video-upload-events")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

producer = None

def init_kafka():
    global producer
    max_retries = 10
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Initializing Kafka (attempt {attempt + 1}/{max_retries})")
            
            ensure_topic_exists()
            
            producer = KafkaProducer(
                bootstrap_servers=KAFKA_SERVERS.split(","),
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                acks='all',
                retries=3,
                request_timeout_ms=30000,
                max_block_ms=60000
            )
            logger.info("KafkaProducer created successfully")
            return
            
        except NoBrokersAvailable as e:
            logger.warning(f"Kafka not available (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error("Failed to initialize Kafka after all retries")
                producer = None
                
        except Exception as e:
            logger.error(f"Failed to initialize Kafka: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                producer = None

def get_kafka_producer():
    global producer
    if producer is None:
        init_kafka()
    return producer

@app.on_event("startup")
async def startup_event():
    init_kafka()

@app.post("/minio-webhook")
async def handle_minio_webhook(request: Request):
    payload = await request.json()
    logger.info(f"Received webhook from MinIO: {payload}")

    p = get_kafka_producer()
    if p is not None:
        try:
            future = p.send(KAFKA_TOPIC, value=payload)
            record_metadata = future.get(timeout=10)
            logger.info(f"Event sent to Kafka topic {record_metadata.topic}, partition {record_metadata.partition}, offset {record_metadata.offset}")
        except Exception as e:
            logger.error(f"Failed to send event to Kafka: {e}")
    else:
        logger.error("Kafka producer is not available")

    return {"status": "ok"}

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "notification-service",
        "kafka_topic": KAFKA_TOPIC,
        "kafka_configured": producer is not None
    }