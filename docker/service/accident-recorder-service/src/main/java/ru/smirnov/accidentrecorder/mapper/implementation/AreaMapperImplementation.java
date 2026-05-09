package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.mapper.abstraction.AreaMapper;

@Component
public class AreaMapperImplementation implements AreaMapper {

    @Override
    public AreaShortcutResponse areaEntityToAreaShortcutResponse(Area area) {
        AreaShortcutResponse dto = new AreaShortcutResponse();
        dto.setId(area.getId());
        dto.setName(area.getName());
        return dto;
    }

    @Override
    public AreaResponse areaEntityToAreaResponse(Area area) {
        AreaResponse areaResponse = new AreaResponse();

        return areaResponse;
    }

    @Override
    public Area generateAreaEntityByAreaResponse(AreaCreationRequest dto) {
        // if dto.getForemanId == null .....
    }
}
