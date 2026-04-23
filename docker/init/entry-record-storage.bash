#!/bin/bash
set -e

echo "=== Инициализация entry-record-storage ==="

echo "Ожидание MinIO..."
until mc alias set local http://entry-record-storage:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" 2>/dev/null; do
  echo "MinIO ещё не готов..."
  sleep 2
done
echo "✓ MinIO доступен"

echo "Создание бакетов: $MINIO_BUCKETS"
echo "$MINIO_BUCKETS" | tr ',' '\n' | while read -r bucket; do
  mc mb -p local/"$bucket" 2>/dev/null || true
done

echo "=== Ждём, пока notification-service стартует... ==="
sleep 30

# Настройка webhook
echo "=== Настройка webhook (notification-service) ==="
mc admin config set local notify_webhook:1 \
  endpoint="http://notification-service:8000/minio-webhook" \
  queue_limit=1000 \
  enable=on || {
  echo "⚠ Не удалось установить webhook сразу."
  sleep 10
}

echo "=== Перезапуск MinIO для активации webhook ==="
mc admin service restart local --json || true

# ================================
# Вывод установленных уведомлений
# ================================
echo ""
echo "=== Текущие правила уведомлений для бакета records ==="
mc event list local/records

echo "=== Готово: события пойдут в /minio-webhook ==="
# #!/bin/bash
# set -e

# echo "=== Инициализация entry-record-storage ==="

# echo "Ожидание MinIO..."
# until mc alias set local http://entry-record-storage:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" 2>/dev/null; do
#   echo "MinIO ещё не готов..."
#   sleep 2
# done
# echo "✓ MinIO доступен"

# echo "Создание бакетов: $MINIO_BUCKETS"
# echo "$MINIO_BUCKETS" | tr ',' '\n' | while read -r bucket; do
#   mc mb -p local/"$bucket" 2>/dev/null || true
# done

# echo "=== Ждём, пока notification-service стартует... ==="
# sleep 30

# # Попытка установить webhook
# echo "=== Настройка webhook (notification-service) ==="
# mc admin config set local notify_webhook:1 \
#   endpoint="http://notification-service:8000/minio-webhook" \
#   queue_limit=1000 \
#   enable=on || {
#   echo "⚠ Не удалось установить webhook сразу."
#   sleep 10
# }

# echo "=== Перезапуск MinIO для активации webhook ==="
# mc admin service restart local --json || true

# echo "=== Готово: события пойдут в /minio-webhook ==="