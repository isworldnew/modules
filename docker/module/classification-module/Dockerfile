FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY kafka_consumer.py .
COPY kafka_producer.py .

RUN mkdir -p /app/config /app/models


ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["python", "app.py"]