FROM python:3.11-slim

# =========================
# System deps
# =========================
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libjpeg-dev \
    zlib1g-dev \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# =========================
# pip upgrade
# =========================
RUN pip install --upgrade pip --default-timeout=100

# =========================
# Python deps
# =========================
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt \
    --index-url https://download.pytorch.org/whl/cpu \
    --extra-index-url https://pypi.org/simple

# =========================
# workdir
# =========================
WORKDIR /app

# =========================
# env (Ultralytics cache)
# =========================
ENV YOLO_CONFIG_DIR=/app/config

# =========================
# app files
# =========================
COPY main.py .
COPY videos/ ./videos/
COPY jsons/ ./jsons/
COPY models/ ./models/

# =========================
# output dirs
# =========================
RUN mkdir -p /app/crops

# =========================
# run
# =========================
CMD ["python", "main.py"]