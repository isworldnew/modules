package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.Camera;

@Repository
public interface CameraRepository extends JpaRepository<Camera, Long> {
}
