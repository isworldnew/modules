from kafka.admin import KafkaAdminClient, NewTopic
from kafka.errors import TopicAlreadyExistsError
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

KAFKA_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "record-storage-broker:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "video-upload-events")
NUM_PARTITIONS = int(os.getenv("KAFKA_NUM_PARTITIONS", "5"))
REPLICATION_FACTOR = int(os.getenv("KAFKA_REPLICATION_FACTOR", "1"))

def ensure_topic_exists():
    """Создает топик с заданными параметрами, если он не существует"""
    try:
        admin_client = KafkaAdminClient(
            bootstrap_servers=KAFKA_SERVERS.split(","),
            client_id='notification-service'
        )
        
        topic_exists = False
        existing_topics = admin_client.list_topics()
        
        if KAFKA_TOPIC in existing_topics:
            topic_metadata = admin_client.describe_topics([KAFKA_TOPIC])
            if topic_metadata:
                existing_partitions = len(topic_metadata[0].partitions)
                if existing_partitions != NUM_PARTITIONS:
                    logger.warning(f"Topic {KAFKA_TOPIC} already exists but with {existing_partitions} partitions (expected {NUM_PARTITIONS})")
                else:
                    logger.info(f"Topic {KAFKA_TOPIC} already exists with {NUM_PARTITIONS} partitions")
            topic_exists = True
        
        if not topic_exists:
            new_topic = NewTopic(
                name=KAFKA_TOPIC,
                num_partitions=NUM_PARTITIONS,
                replication_factor=REPLICATION_FACTOR
            )
            
            admin_client.create_topics([new_topic])
            logger.info(f"Topic {KAFKA_TOPIC} created successfully with {NUM_PARTITIONS} partitions")
        
        admin_client.close()
        
    except TopicAlreadyExistsError:
        logger.info(f"Topic {KAFKA_TOPIC} already exists")
    except Exception as e:
        logger.error(f"Failed to create topic: {e}")
        raise