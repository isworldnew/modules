import os
import json
import logging
import time

from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration for accident broker
ACCIDENT_BROKER_SERVERS = os.getenv("ACCIDENT_BROKER_SERVERS", "accident-broker:9092")
ACCIDENT_TOPIC = os.getenv("ACCIDENT_TOPIC", "accident-events")

producer = None

def init_accident_producer():
    """Initialize Kafka producer for accident broker"""
    global producer
    
    max_retries = 10
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Initializing accident producer (attempt {attempt + 1}/{max_retries})")
            
            producer = KafkaProducer(
                bootstrap_servers=ACCIDENT_BROKER_SERVERS.split(","),
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                acks='all',
                retries=3,
                request_timeout_ms=30000,
                max_block_ms=60000
            )
            
            logger.info("Accident KafkaProducer created successfully")
            return True
            
        except NoBrokersAvailable as e:
            logger.warning(f"Accident broker not available (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error("Failed to initialize accident producer after all retries")
                producer = None
                return False
                
        except Exception as e:
            logger.error(f"Failed to initialize accident producer: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                producer = None
                return False
    
    return False

def send_accident_message(message: dict) -> bool:
    """Send message to accident broker"""
    global producer
    
    if producer is None:
        logger.warning("Accident producer not initialized, attempting to initialize...")
        if not init_accident_producer():
            logger.error("Cannot send accident message: producer unavailable")
            return False
    
    try:
        future = producer.send(ACCIDENT_TOPIC, value=message)
        record_metadata = future.get(timeout=10)
        logger.info(f"Accident message sent to topic {record_metadata.topic}, "
                   f"partition {record_metadata.partition}, "
                   f"offset {record_metadata.offset}, "
                   f"object_id={message.get('object_id')}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send accident message: {e}")
        return False

def close_accident_producer():
    """Close the producer gracefully"""
    global producer
    if producer:
        producer.flush()
        producer.close()
        logger.info("Accident producer closed")