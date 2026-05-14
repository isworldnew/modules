package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.entity.domain.Camera;
import ru.smirnov.accidentrecorder.mapper.abstraction.CameraMapper;
import ru.smirnov.accidentrecorder.repository.domain.CameraRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.CameraService;

import java.util.List;

@Service
public class CameraServiceImplementation implements CameraService {

    private final CameraRepository cameraRepository;

    @Autowired
    public CameraServiceImplementation(CameraRepository cameraRepository) {
        this.cameraRepository = cameraRepository;
    }

}
