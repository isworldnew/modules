package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.dto.request.CameraCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;
import ru.smirnov.accidentrecorder.dto.response.CameraShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.entity.domain.Camera;
import ru.smirnov.accidentrecorder.mapper.abstraction.CameraMapper;
import ru.smirnov.accidentrecorder.precondition.abstraction.AreaPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.CameraRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.CameraService;

import java.util.List;

@Service
public class CameraServiceImplementation implements CameraService {

    private final CameraRepository cameraRepository;
    private final AreaPreconditionService areaPreconditionService;
    private final CameraMapper cameraMapper;

    @Autowired
    public CameraServiceImplementation(CameraRepository cameraRepository, AreaPreconditionService areaPreconditionService, CameraMapper cameraMapper) {
        this.cameraRepository = cameraRepository;
        this.areaPreconditionService = areaPreconditionService;
        this.cameraMapper = cameraMapper;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Long createCamera(CameraCreationRequest dto) {
        Area area = this.areaPreconditionService.safelyGetAreaById(dto.getAreaId());

        Camera camera = new Camera();

        camera.setName(dto.getName());
        camera.setArea(area);

        this.cameraRepository.save(camera);

        return camera.getId();
    }

    @Override
    public List<CameraShortcutResponse> getCameraShortcuts() {
        return this.cameraRepository.findAllCamerasOrderByArea().stream()
                .map(this.cameraMapper::cameraEntityToCameraShortcutResponse)
                .toList();
    }
}
