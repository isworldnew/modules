package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.entity.domain.Area;

import java.util.List;

public interface AreaService {

    Area getAreaByForemanId(Long foremanId);

    Long createArea(AreaCreationRequest dto);

    List<AreaResponse> getAreas();
}
