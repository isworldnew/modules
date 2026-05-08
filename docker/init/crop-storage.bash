set -e

echo "Ожидание запуска crop-storage..."

until mc alias set local http://crop-storage:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"; do
  echo "crop-storage ещё не готов..."
  sleep 2
done

echo "crop-storage доступен"

echo "Создание бакетов: $MINIO_BUCKETS"

echo "$MINIO_BUCKETS" | tr ',' '\n' | while read -r bucket; do
  mc mb -p local/"$bucket" || true
done

echo "Инициализация crop-storage завершена"