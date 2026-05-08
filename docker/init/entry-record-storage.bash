set -e

echo "Ожидание запуска entry-record-storage..."

until mc alias set local http://entry-record-storage:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"; do
  echo "entry-record-storage ещё не готов..."
  sleep 2
done

echo "entry-record-storage доступен"

echo "Создание бакетов: $MINIO_BUCKETS"

echo "$MINIO_BUCKETS" | tr ',' '\n' | while read -r bucket; do
  mc mb -p local/"$bucket" || true
done

echo "Инициализация entry-record-storage завершена"