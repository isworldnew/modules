```sql
INSERT INTO users(username, password, role, status, lastname, firstname, parentname) VALUES
(
    'admin1@test.mail',
    '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.',
    'ADMIN',
    'ENABLED',
    'Ермаков',
    'Александр',
    'Вадимович'
),
(
    'safety-officer1@test.mail',
    '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.',
    'SAFETY_OFFICER',
    'ENABLED',
    'Смирнов',
    'Иван',
    'Вадимович'
);

INSERT INTO areas(name) VALUES
('Основной склад'),
('Подсобное помещение');

INSERT INTO cameras(name, area_id) VALUES
('camera1', 1),
('camera2', 2);
```