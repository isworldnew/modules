package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.dto.request.CameraCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;
import ru.smirnov.accidentrecorder.dto.response.CameraShortcutResponse;

import java.util.List;

public interface CameraService {
    Long createCamera(CameraCreationRequest dto);

    List<CameraShortcutResponse> getCameraShortcuts();
}
