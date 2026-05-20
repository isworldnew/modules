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

#### Шаг 3.

Через `pg-admin` (контейнер `accident-database-ui`) добавить данные:  
```sql
INSERT INTO users(username, password, role, status, lastname, firstname, parentname) VALUES
(
    'admin1@test.mail',
    '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.',
    'ADMIN',
    'ENABLED',
    'Нестеров',
    'Леонид',
    'Иванович'
),
(
    'supervisor1@test.mail',
    '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.',
    'SUPERVISOR',
    'ENABLED',
    'Аткарский',
    'Пётр',
    'Николаевич'
),
(
    'foreman1@test.mail',
    '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.',
    'FOREMAN',
    'ENABLED',
    'Куликов',
    'Димитр',
    'Анатольевич'
),
(
    'foreman2@test.mail',
    '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.',
    'FOREMAN',
    'ENABLED',
    'Диденко',
    'Олег',
    'Павлович'
),
(
    'safety-officer1@test.mail',
    '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.',
    'SAFETY_OFFICER',
    'ENABLED',
    'Смирнов',
    'Иван',
    'Вадимович'
),
(
    'safety-officer2@test.mail',
    '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.',
    'SAFETY_OFFICER',
    'ENABLED',
    'Данилов',
    'Сергей',
    'Дмитриевич'
);

INSERT INTO areas(name, foreman_id) VALUES
('Основной склад', 3);
-- ('Подсобное помещение');

INSERT INTO cameras(name, area_id) VALUES
('camera1', 1),
('camera2', 1);
```