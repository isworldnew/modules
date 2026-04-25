При первом запуске:

#### Шаг 1.

```bash
docker-compose up --build
```

#### Шаг 2.

Внутри контейнера `entry-record-storage` в разделе `exec`:

```bash
mc alias set local http://localhost:9000 ivan-student ivan-student
```

```bash
mc admin config set local notify_webhook:1 \
  endpoint="http://notification-service:8000/minio-webhook" \
  queue_limit=1000 \
  enable=on
```

```bash
mc admin service restart local
```

```bash
mc event add local/records arn:minio:sqs::1:webhook --event put
```

Для проверки:  
```bash
mc event list local/records
>> arn:minio:sqs::1:webhook   s3:ObjectCreated:*   Filter:
```