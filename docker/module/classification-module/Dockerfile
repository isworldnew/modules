FROM python:3.11-slim

# System dependencies
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

# Copy requirements first for better caching
COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY kafka_consumer.py .
COPY kafka_producer.py .

# Create directories for config and models (even if empty)
RUN mkdir -p /app/config /app/models

# Copy pre-loaded config and models if they exist (optional)
# COPY config/ /app/config/
# COPY models/ /app/models/

# Default environment variables
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

CMD ["python", "app.py"]