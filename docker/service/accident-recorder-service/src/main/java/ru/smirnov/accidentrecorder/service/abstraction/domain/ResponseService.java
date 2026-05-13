package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.dto.request.ResponseCreationRequest;

public interface ResponseService {

    Long createResponse(ResponseCreationRequest dto);
}
