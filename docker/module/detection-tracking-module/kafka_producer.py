import os
import json
import logging
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DETECTION_BROKER_SERVERS = os.getenv("DETECTION_BROKER_SERVERS", "detection-broker:9092")
DETECTION_TOPIC = os.getenv("DETECTION_TOPIC", "detected-persons")

producer = None

def init_detection_producer():
    global producer
    
    max_retries = 10
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Initializing detection producer (attempt {attempt + 1}/{max_retries})")
            
            producer = KafkaProducer(
                bootstrap_servers=DETECTION_BROKER_SERVERS.split(","),
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                acks='all',
                retries=3,
                request_timeout_ms=30000,
                max_block_ms=60000
            )
            
            logger.info("Detection KafkaProducer created successfully")
            return True
            
        except NoBrokersAvailable as e:
            logger.warning(f"Detection broker not available (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error("Failed to initialize detection producer after all retries")
                producer = None
                return False
                
        except Exception as e:
            logger.error(f"Failed to initialize detection producer: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                producer = None
                return False
    
    return False

def send_detection_message(object_id: str, crops_amount: int):
    global producer
    
    if producer is None:
        logger.warning("Detection producer not initialized, attempting to initialize...")
        if not init_detection_producer():
            logger.error("Cannot send detection message: producer unavailable")
            return False
    
    message = {
        "object_id": object_id,
        "crops_amount": crops_amount
    }
    
    try:
        future = producer.send(DETECTION_TOPIC, value=message)
        record_metadata = future.get(timeout=10)
        logger.info(f"Detection message sent to topic {record_metadata.topic}, "
                   f"partition {record_metadata.partition}, "
                   f"offset {record_metadata.offset}, "
                   f"object_id={object_id}, crops={crops_amount}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send detection message: {e}")
        return False

def close_detection_producer():
    global producer
    if producer:
        producer.flush()
        producer.close()
        logger.info("Detection producer closed")