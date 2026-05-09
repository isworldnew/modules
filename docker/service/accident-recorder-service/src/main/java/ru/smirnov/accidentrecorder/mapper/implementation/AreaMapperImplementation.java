package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.Role;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.entity.relation.OperatedArea;
import ru.smirnov.accidentrecorder.exception.ConflictException;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.mapper.abstraction.AreaMapper;
import ru.smirnov.accidentrecorder.mapper.abstraction.OperatedAreaMapper;
import ru.smirnov.accidentrecorder.mapper.abstraction.UserMapper;
import ru.smirnov.accidentrecorder.precondition.abstraction.UserPreconditionService;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AreaMapperImplementation implements AreaMapper {

    private final UserMapper userMapper;
    private final UserPreconditionService userPreconditionService;

    @Autowired
    public AreaMapperImplementation(UserMapper userMapper, UserPreconditionService userPreconditionService) {
        this.userMapper = userMapper;
        this.userPreconditionService = userPreconditionService;
    }

    @Override
    public AreaShortcutResponse areaEntityToAreaShortcutResponse(Area area) {
        AreaShortcutResponse dto = new AreaShortcutResponse();
        dto.setId(area.getId());
        dto.setName(area.getName());
        return dto;
    }

    @Override
    public AreaResponse areaEntityToAreaResponse(Area area) {

        User foreman = area.getOperators().stream()
                .map(OperatedArea::getForeman)
                .findFirst()
                .orElse(null);

        List<UserResponse> safetyOfficers = area.getOperators().stream()
                .map(OperatedArea::getSafetyOfficer)
                .map(this.userMapper::userEntityToUserResponse)
                .collect(Collectors.toList());

        AreaResponse areaResponse = new AreaResponse();

        areaResponse.setId(area.getId());
        areaResponse.setName(area.getName());

        if (foreman != null) areaResponse.setForeman(this.userMapper.userEntityToUserResponse(foreman));

        areaResponse.setSafetyOfficers(safetyOfficers);

        return areaResponse;
    }

    @Override
    public Area generateAreaEntityByAreaResponse(AreaCreationRequest dto) {
        Area area = new Area();
        area.setName(dto.getName());
        return area;
    }
}
