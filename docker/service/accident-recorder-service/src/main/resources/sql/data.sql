INSERT INTO users(username, password, role, status, lastname, firstname, parentname)
SELECT * FROM (
    VALUES
        ('admin1@test.mail', '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.', 'ADMIN', 'ENABLED', 'Нестеров', 'Леонид', 'Иванович'),
        ('supervisor1@test.mail', '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.', 'SUPERVISOR', 'ENABLED', 'Аткарский', 'Пётр', 'Николаевич'),
        ('foreman1@test.mail', '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.', 'FOREMAN', 'ENABLED', 'Куликов', 'Димитр', 'Анатольевич'),
        ('foreman2@test.mail', '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.', 'FOREMAN', 'ENABLED', 'Диденко', 'Олег', 'Павлович'),
        ('safety-officer1@test.mail', '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.', 'SAFETY_OFFICER', 'ENABLED', 'Смирнов', 'Иван', 'Вадимович'),
        ('safety-officer2@test.mail', '$2a$10$idCIIywXNewOAZd3A9j1QeqEIdHVEeEMwaD/JGpL31cDej.ijrZ9.', 'SAFETY_OFFICER', 'ENABLED', 'Данилов', 'Сергей', 'Дмитриевич')
) AS v(username, password, role, status, lastname, firstname, parentname)
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = v.username);

INSERT INTO areas(name, foreman_id)
SELECT 'Основной склад', 3
WHERE NOT EXISTS (SELECT 1 FROM areas WHERE name = 'Основной склад')
  AND EXISTS (SELECT 1 FROM users WHERE id = 3 AND role = 'FOREMAN');

INSERT INTO cameras(name, area_id)
SELECT 'camera1', 1
WHERE NOT EXISTS (SELECT 1 FROM cameras WHERE name = 'camera1' AND area_id = 1);

INSERT INTO cameras(name, area_id)
SELECT 'camera2', 1
WHERE NOT EXISTS (SELECT 1 FROM cameras WHERE name = 'camera2' AND area_id = 1);