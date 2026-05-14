package ru.smirnov.accidentrecorder.mapper.abstraction;


import ru.smirnov.accidentrecorder.dto.response.CameraResponse;
import ru.smirnov.accidentrecorder.entity.domain.Camera;

public interface CameraMapper {

    CameraResponse cameraEntityToCameraResponse(Camera camera);

}
