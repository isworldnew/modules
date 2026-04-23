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
# Workdir
# =========================
WORKDIR /app

# =========================
# Python deps
# =========================
COPY requirements.txt .

RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt \
    --index-url https://download.pytorch.org/whl/cpu \
    --extra-index-url https://pypi.org/simple

# =========================
# App
# =========================
COPY main.py .
COPY models/ ./models/

# =========================
# Dirs
# =========================
RUN mkdir -p /app/uploads

# =========================
# Env
# =========================
ENV YOLO_CONFIG_DIR=/app/config
ENV PYTHONUNBUFFERED=1

# =========================
# Run
# =========================
CMD ["gunicorn", "-w", "2", "-k", "gthread", "-t", "0", "-b", "0.0.0.0:5000", "main:app"]