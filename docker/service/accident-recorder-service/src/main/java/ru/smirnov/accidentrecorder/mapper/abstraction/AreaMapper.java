package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Area;

public interface AreaMapper {

    AreaShortcutResponse areaEntityToAreaShortcutResponse(Area area);

    AreaResponse areaEntityToAreaResponse(Area area);

    Area generateAreaEntityByAreaResponse(AreaCreationRequest dto);
}
