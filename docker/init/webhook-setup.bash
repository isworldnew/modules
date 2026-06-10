#!/bin/bash
set -e

echo "===== Webhook Setup Container ====="

echo "Ожидание MinIO..."
until mc alias set local http://entry-record-storage:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" 2>/dev/null; do
  echo "MinIO не готов, ждём 2 секунды..."
  sleep 2
done
echo "MinIO готов"

echo "Ожидание notification-service..."
until (echo > /dev/tcp/notification-service/8000) 2>/dev/null; do
  echo "notification-service не готов, ждём 2 секунды..."
  sleep 2
done
echo "notification-service готов"

sleep 5

echo "Настройка webhook в MinIO..."
mc admin config set local notify_webhook:1 \
  endpoint="http://notification-service:8000/minio-webhook" \
  queue_limit=1000 \
  enable=on

echo "Webhook настроен"

echo "Перезапуск MinIO через docker..."
if command -v docker &> /dev/null; then
  docker restart entry-record-storage
else
  echo "docker not found, using mc with --json flag..."
  mc admin service restart local --json || true
fi

echo "Ожидание перезапуска MinIO (15 секунд)..."
sleep 15

echo "Восстановление соединения с MinIO..."
until mc alias set local http://entry-record-storage:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" 2>/dev/null; do
  echo "MinIO не готов, ждём 2 секунды..."
  sleep 2
done
echo "MinIO снова доступен"

echo "Добавление webhook события на бакет 'records'..."
mc event add local/records arn:minio:sqs::1:webhook --event put

echo "Событие добавлено"

echo "===== Активные события ====="
mc event list local/records

echo "===== Webhook setup completed successfully ====="