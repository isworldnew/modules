package ru.smirnov.accidentrecorder.repository.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.domain.Camera;

import java.util.List;

@Repository
public interface CameraRepository extends JpaRepository<Camera, Long> {

    @Query("SELECT camera FROM Camera camera JOIN camera.area area ORDER BY area.name ASC")
    List<Camera> findAllCamerasOrderByArea();

}
