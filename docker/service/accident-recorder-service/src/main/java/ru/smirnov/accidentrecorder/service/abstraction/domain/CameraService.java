package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.dto.request.CameraCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.CameraResponse;

import java.util.List;

public interface CameraService {

    Long createCamera(CameraCreationRequest dto);

    List<CameraResponse> getCameras();
}
