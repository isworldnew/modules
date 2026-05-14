package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.entity.domain.Area;

public interface AreaMapper {

    AreaResponse areaEntityToAreaResponse(Area area);
}
