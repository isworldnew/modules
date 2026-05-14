package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.response.CameraResponse;
import ru.smirnov.accidentrecorder.entity.domain.Camera;
import ru.smirnov.accidentrecorder.mapper.abstraction.CameraMapper;

@Component
public class CameraMapperImplementation implements CameraMapper {

    @Override
    public CameraResponse cameraEntityToCameraResponse(Camera camera) {
        CameraResponse cameraResponse = new CameraResponse();
        cameraResponse.setId(camera.getId());
        cameraResponse.setName(camera.getName());
        cameraResponse.setAreaId(camera.getArea().getId());
        cameraResponse.setAreaName(camera.getArea().getName());
        return cameraResponse;
    }

}
