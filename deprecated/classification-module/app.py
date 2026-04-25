import os
import json
import torch
import threading

from flask import Flask, request, jsonify
from torchvision import transforms, models
import torch.nn as nn
from PIL import Image
import torchvision.transforms.functional as F

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CONFIG_DIR = os.path.join(BASE_DIR, "config")
MODELS_DIR = os.path.join(BASE_DIR, "models")

CONFIG_PATH = os.path.join(CONFIG_DIR, "config.json")
MODEL_PATH = os.path.join(MODELS_DIR, "model.pth")

IMAGE_SIZE = 224
DROPOUT = 0.5

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_lock = threading.Lock()

app = Flask(__name__)

os.makedirs(CONFIG_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

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
    model = models.resnet34(weights=None)

    num_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Dropout(DROPOUT),
        nn.Linear(num_features, 2) // вот тут подтянуть количество классов из config.json
    )

    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    model.load_state_dict(checkpoint["model_state_dict"])

    model = model.to(DEVICE)
    model.eval()

    return model


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.route("/config", methods=["POST"])
def upload_config():
    if "file" not in request.files:
        return jsonify({"message": "Файл модели должен иметь вид: config.расширение"}), 400

    file = request.files["file"]

    if not file.filename.startswith("config."):
        return jsonify({"message": "Файл модели должен иметь вид: config.расширение"}), 400

    file.save(CONFIG_PATH)

    return jsonify({"message": "Конфигурация загружена"}), 200

@app.route("/models/upload", methods=["POST"])
def upload_model():
    if "file" not in request.files:
        return jsonify({"message": "Файл модели должен иметь вид: model.pth"}), 400

    file = request.files["file"]

    if file.filename != "model.pth":
        return jsonify({"message": "Файл модели должен иметь вид: model.pth"}), 400

    file.save(MODEL_PATH)

    return jsonify({"message": "Модель загружена"}), 200

@app.route("/predictions/predict", methods=["POST"])
def predict():
    if not os.path.exists(MODEL_PATH):
        return jsonify({"message": "Модель не загружена"}), 400

    if not os.path.exists(CONFIG_PATH):
        return jsonify({"message": "Конфигурация не загружена"}), 400

    files = request.files.getlist("files")

    if len(files) == 0:
        return jsonify({"message": "Нужно не менее одного изображения типа .jpg"}), 400

    for f in files:
        if not f.filename.lower().endswith(".jpg"):
            return jsonify({"message": "Нужно более одного изображения типа .jpg"}), 400

    config = load_config()

    with model_lock:
        model = load_model()

        class_votes = {}
        class_conf_sum = {}

        for file in files:
            image = Image.open(file).convert("RGB")
            image = transform(image).unsqueeze(0).to(DEVICE)

            with torch.no_grad():
                outputs = model(image)
                probs = torch.softmax(outputs, dim=1)

                confidence, pred_class = torch.max(probs, dim=1)

                cls = pred_class.item()
                conf = confidence.item()

                class_votes[cls] = class_votes.get(cls, 0) + 1
                class_conf_sum[cls] = class_conf_sum.get(cls, 0) + conf


    max_votes = max(class_votes.values())

    top_classes = [
        cls for cls, v in class_votes.items()
        if v == max_votes
    ]

    default_class = config.get("default", 0)

    if len(top_classes) == 1:
        best_class = top_classes[0]
    else:
        best_class = default_class

    avg_conf = class_conf_sum[best_class] / class_votes[best_class]

    return jsonify({
        "class": config[str(best_class)],
        "avg_confidence": avg_conf
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)