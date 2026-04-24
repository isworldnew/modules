from fastapi import FastAPI, Request
import json
from kafka import KafkaProducer
import os
import logging
from kafka_config import ensure_topic_exists

app = FastAPI()

KAFKA_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "record-storage-broker:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "video-upload-events")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

producer = None

def init_kafka():
    """Инициализирует топик и продюсера"""
    global producer
    try:
        ensure_topic_exists()
        
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_SERVERS.split(","),
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            acks='all',
            retries=3
        )
        logger.info("KafkaProducer created successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Kafka: {e}")
        producer = None

def get_kafka_producer():
    global producer
    if producer is None:
        init_kafka()
    return producer

@app.on_event("startup")
async def startup_event():
    """При запуске приложения инициализирует Kafka"""
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
    
# from fastapi import FastAPI, Request
# import json
# from kafka import KafkaProducer
# import os
# import logging

# app = FastAPI()

# KAFKA_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "record-storage-broker:9092")
# KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "video-upload-events")

# logging.basicConfig(level=logging.INFO)

# producer = None


# def get_kafka_producer():
#     global producer
#     if producer is None:
#         try:
#             producer = KafkaProducer(
#                 bootstrap_servers=KAFKA_SERVERS.split(","),
#                 value_serializer=lambda v: json.dumps(v).encode("utf-8"),
#             )
#             logging.info("KafkaProducer created")
#         except Exception as e:
#             logging.warning("Failed to create KafkaProducer: %s", e)
#     return producer


# @app.post("/minio-webhook")
# async def handle_minio_webhook(request: Request):
#     payload = await request.json()
#     logging.info("Received webhook from MinIO: %r", payload)

#     p = get_kafka_producer()
#     if p is not None:
#         try:
#             p.send(KAFKA_TOPIC, value=payload).get(timeout=10)
#             logging.info("Event sent to Kafka: %s", KAFKA_TOPIC)
#         except Exception as e:
#             logging.error("Failed to send event to Kafka: %s", e)

#     return {"status": "ok"}


# @app.get("/health")
# async def health():
#     return {"status": "ok", "service": "notification-service"}