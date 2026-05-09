package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;

import java.util.List;

public interface AreaService {
    Long createArea(AreaCreationRequest dto);

    List<AreaShortcutResponse> getAreaShortcuts();

    AreaResponse getAreaById(Long id);
}
