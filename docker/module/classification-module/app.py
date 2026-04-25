import os
import json
import torch
import threading
import logging
from io import BytesIO

from flask import Flask, request, jsonify
from torchvision import transforms, models
import torch.nn as nn
from PIL import Image
import torchvision.transforms.functional as F
from minio import Minio

from kafka_consumer import start_consumer
from kafka_producer import init_accident_producer, send_accident_message, close_accident_producer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CONFIG_DIR = os.path.join(BASE_DIR, "config")
MODELS_DIR = os.path.join(BASE_DIR, "models")

CONFIG_PATH = os.path.join(CONFIG_DIR, "config.json")
MODEL_PATH = os.path.join(MODELS_DIR, "model.pth")

IMAGE_SIZE = 224
DROPOUT = 0.5

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# MinIO configuration for crop-storage
CROP_MINIO_ENDPOINT = os.getenv("CROP_MINIO_ENDPOINT", "crop-storage:9000")
CROP_MINIO_ACCESS_KEY = os.getenv("CROP_MINIO_ACCESS_KEY", "ivan-student")
CROP_MINIO_SECRET_KEY = os.getenv("CROP_MINIO_SECRET_KEY", "ivan-student")
CROP_MINIO_BUCKET = os.getenv("CROP_MINIO_BUCKET", "crops")

# Model lock for thread safety
model_lock = threading.Lock()

app = Flask(__name__)

os.makedirs(CONFIG_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# MinIO client
minio_client = Minio(
    CROP_MINIO_ENDPOINT,
    access_key=CROP_MINIO_ACCESS_KEY,
    secret_key=CROP_MINIO_SECRET_KEY,
    secure=False
)

class SquarePad:
    def __call__(self, image):
        w, h = image.size
        max_side = max(w, h)

        pad_left = (max_side - w) // 2
        pad_top = (max_side - h) // 2
        pad_right = max_side - w - pad_left
        pad_bottom = max_side - h - pad_top

        return F.pad(image, (pad_left, pad_top, pad_right, pad_bottom), fill=0)

transform = transforms.Compose([
    SquarePad(),
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
])

def load_model():
    """Load model with current config"""
    if not os.path.exists(MODEL_PATH) or not os.path.exists(CONFIG_PATH):
        return None
    
    config = load_config()
    num_classes = len(config) - 1 if "default" in config else len(config)  # exclude default if present
    
    model = models.resnet34(weights=None)
    num_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(DROPOUT),
        nn.Linear(num_features, num_classes)
    )
    
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    model.load_state_dict(checkpoint["model_state_dict"])
    
    model = model.to(DEVICE)
    model.eval()
    
    return model

def load_config():
    """Load configuration from file"""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def download_crop_from_minio(object_name: str) -> Image.Image:
    """Download a single crop from MinIO"""
    try:
        response = minio_client.get_object(CROP_MINIO_BUCKET, object_name)
        image_data = response.read()
        response.close()
        response.release_conn()
        
        image = Image.open(BytesIO(image_data)).convert("RGB")
        return image
    except Exception as e:
        logger.error(f"Failed to download crop {object_name}: {e}")
        return None

def get_crops_for_object(object_id: str, expected_count: int) -> list:
    """Get all crops for a given object_id"""
    crops = []
    
    # Try to get exact matches with pattern object_id_{index}.jpg
    for i in range(expected_count):
        object_name = f"{object_id}_{i}.jpg"
        image = download_crop_from_minio(object_name)
        if image is not None:
            crops.append(image)
        else:
            logger.warning(f"Crop not found: {object_name}")
    
    # Alternative: try to list objects with prefix if exact matching didn't work
    if len(crops) == 0:
        try:
            objects = minio_client.list_objects(CROP_MINIO_BUCKET, prefix=object_id, recursive=True)
            for obj in objects:
                image = download_crop_from_minio(obj.object_name)
                if image is not None:
                    crops.append(image)
        except Exception as e:
            logger.error(f"Failed to list crops for {object_id}: {e}")
    
    return crops

def classify_crops(crops: list) -> dict:
    """Classify a list of crop images and return voting results"""
    if not crops:
        return None
    
    config = load_config()
    
    with model_lock:
        model = load_model()
        if model is None:
            logger.error("Model not loaded for classification")
            return None
        
        class_votes = {}
        class_conf_sum = {}
        
        for image in crops:
            # Transform image
            image_tensor = transform(image).unsqueeze(0).to(DEVICE)
            
            with torch.no_grad():
                outputs = model(image_tensor)
                probs = torch.softmax(outputs, dim=1)
                confidence, pred_class = torch.max(probs, dim=1)
                
                cls = pred_class.item()
                conf = confidence.item()
                
                class_votes[cls] = class_votes.get(cls, 0) + 1
                class_conf_sum[cls] = class_conf_sum.get(cls, 0) + conf
        
        # Determine best class by voting
        max_votes = max(class_votes.values())
        top_classes = [cls for cls, v in class_votes.items() if v == max_votes]
        
        default_class = config.get("default", 0)
        
        if len(top_classes) == 1:
            best_class = top_classes[0]
        else:
            best_class = default_class
        
        avg_conf = class_conf_sum[best_class] / class_votes[best_class]
        
        return {
            "class": config.get(str(best_class), "unknown"),
            "class_id": best_class,
            "avg_confidence": avg_conf
        }

def process_classification_message(object_id: str, crops_amount: int):
    """Process a single classification request"""
    logger.info(f"[CLASSIFY] Processing object_id={object_id}, crops_amount={crops_amount}")
    
    # Check if model and config are loaded
    if not os.path.exists(MODEL_PATH):
        logger.warning(f"[CLASSIFY] Model not loaded, skipping {object_id}")
        return False
    
    if not os.path.exists(CONFIG_PATH):
        logger.warning(f"[CLASSIFY] Config not loaded, skipping {object_id}")
        return False
    
    # Download crops from MinIO
    crops = get_crops_for_object(object_id, crops_amount)
    
    if len(crops) == 0:
        logger.warning(f"[CLASSIFY] No crops found for {object_id}")
        return False
    
    logger.info(f"[CLASSIFY] Downloaded {len(crops)}/{crops_amount} crops for {object_id}")
    
    # Classify the crops
    result = classify_crops(crops)
    
    if result is None:
        logger.error(f"[CLASSIFY] Classification failed for {object_id}")
        return False
    
    # Prepare and send message to accident broker
    accident_message = {
        "object_id": object_id,
        "class": result["class"],
        "class_id": result["class_id"],
        "avg_confidence": result["avg_confidence"]
    }
    
    success = send_accident_message(accident_message)
    
    if success:
        logger.info(f"[CLASSIFY] Successfully processed {object_id}: class={result['class']}, confidence={result['avg_confidence']:.3f}")
    else:
        logger.error(f"[CLASSIFY] Failed to send accident message for {object_id}")
    
    return success

# =========================
# REST API Endpoints
# =========================

@app.route("/config", methods=["POST"])
def upload_config():
    """Upload configuration file"""
    if "file" not in request.files:
        return jsonify({"message": "No file provided"}), 400
    
    file = request.files["file"]
    
    if not file.filename.startswith("config."):
        return jsonify({"message": "File must be named config.*"}), 400
    
    file.save(CONFIG_PATH)
    logger.info(f"Config saved to {CONFIG_PATH}")
    
    return jsonify({"message": "Configuration uploaded successfully"}), 200

@app.route("/models/upload", methods=["POST"])
def upload_model():
    """Upload model file"""
    if "file" not in request.files:
        return jsonify({"message": "No file provided"}), 400
    
    file = request.files["file"]
    
    if file.filename != "model.pth":
        return jsonify({"message": "Model file must be named model.pth"}), 400
    
    file.save(MODEL_PATH)
    logger.info(f"Model saved to {MODEL_PATH}")
    
    return jsonify({"message": "Model uploaded successfully"}), 200

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": os.path.exists(MODEL_PATH),
        "config_loaded": os.path.exists(CONFIG_PATH)
    }), 200

# =========================
# Kafka Setup and Main
# =========================

def start_kafka():
    """Start Kafka consumer in a separate thread"""
    t = threading.Thread(target=start_consumer, daemon=True)
    t.start()

# Initialize Kafka producer
init_accident_producer()

# Start Kafka consumer
start_kafka()

# Cleanup on exit
import atexit

def cleanup():
    close_accident_producer()

atexit.register(cleanup)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)