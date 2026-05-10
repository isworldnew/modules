package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.dto.response.CameraShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Camera;

public interface CameraMapper {

    CameraShortcutResponse cameraEntityToCameraShortcutResponse(Camera camera);
}
