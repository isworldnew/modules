package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.response.CameraShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Camera;
import ru.smirnov.accidentrecorder.mapper.abstraction.CameraMapper;

@Component
public class CameraMapperImplementation implements CameraMapper {

    @Override
    public CameraShortcutResponse cameraEntityToCameraShortcutResponse(Camera camera) {
        CameraShortcutResponse dto = new CameraShortcutResponse();
        dto.setId(camera.getId());
        dto.setName(camera.getName());
        dto.setAreaName(camera.getArea().getName());
        return dto;
    }

}
