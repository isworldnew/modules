#!/bin/bash
set -e

echo "=== Инициализация entry-record-storage ==="


# Ожидание MinIO
echo "Ожидание MinIO..."
until mc alias set local http://entry-record-storage:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" 2>/dev/null; do
  echo "MinIO ещё не готов..."
  sleep 2
done
echo "✓ MinIO доступен"


# Создание бакетов
echo "Создание бакетов: $MINIO_BUCKETS"
echo "$MINIO_BUCKETS" | tr ',' '\n' | while read -r bucket; do
  mc mb -p local/"$bucket" 2>/dev/null || true
done


# Ожидание Kafka
echo "Ожидание Kafka..."
MAX_WAIT=60
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
  if timeout 2 bash -c "echo >/dev/tcp/record-storage-broker/9092" 2>/dev/null; then
    echo "✓ Kafka доступна!"
    break
  fi
  echo "Ожидание Kafka... ($WAITED сек)"
  sleep 5
  WAITED=$((WAITED + 5))
done


# Создаём конфигурацию Kafka
echo "Создание конфигурации Kafka..."
mc admin config set local notify_kafka:1 \
  brokers="record-storage-broker:9092" \
  topic="video-upload-events" \
  queue_dir="/tmp/kafka-queue" \
  queue_limit="10000"

echo "✓ Конфигурация Kafka создана"
echo "=== Инициализация entry-record-storage ==="

# ВНИМАНИЕ: Никакого mc event add в этом скрипте нет,
# так как конфигурация Kafka требует полного рестарта MinIO для активации ARN.
# После рестарта MinIO (через docker compose restart entry-record-storage)
# уже отдельным скриптом или вручную выполняется:
#   mc event add local/records arn:minio:sqs::1:kafka --event put --event complete-multipart-upload