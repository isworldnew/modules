package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.Role;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.exception.ConflictException;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.mapper.abstraction.AreaMapper;
import ru.smirnov.accidentrecorder.precondition.abstraction.AreaPreconditionService;
import ru.smirnov.accidentrecorder.precondition.abstraction.UserPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AreaRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AreaService;

import java.util.List;


@Service
public class AreaServiceImplementation implements AreaService {

    private final AreaRepository areaRepository;
    private final AreaPreconditionService areaPreconditionService;
    private final AreaMapper areaMapper;
    private final UserPreconditionService userPreconditionService;

    @Autowired
    public AreaServiceImplementation(
            AreaRepository areaRepository,
            AreaPreconditionService areaPreconditionService,
            AreaMapper areaMapper,
            UserPreconditionService userPreconditionService
    ) {
        this.areaRepository = areaRepository;
        this.areaPreconditionService = areaPreconditionService;
        this.areaMapper = areaMapper;
        this.userPreconditionService = userPreconditionService;
    }

    @Override
    public Area getAreaByForemanId(Long foremanId) {
        return this.areaRepository.getAreaByForemanId(foremanId).orElseThrow(
                () -> new NotFoundException("No area found operated by foreman (user) id=" + foremanId)
        );
    }

    @Override
    public Long createArea(AreaCreationRequest dto) {
        Area areaFoundByName = this.areaPreconditionService.safelyGetByName(dto.getName()).orElse(null);

        if (areaFoundByName != null)
            throw new ConflictException("Area with name '" + dto.getName() + "' already exists");

        User foreman = this.userPreconditionService.safelyGetById(dto.getForemanId());

        if (foreman.getRole() != Role.FOREMAN || foreman.getForemanArea() != null)
            throw new ConflictException("User with id=" + dto.getForemanId() + " has no role 'FOREMAN' or this foreman already has operated area");

        Area area = new Area();

        area.setForeman(foreman);
        area.setName(dto.getName());

        this.areaRepository.save(area);

        return area.getId();
    }

    @Override
    public List<AreaResponse> getAreas() {
        return this.areaRepository.findAll().stream()
                .map(this.areaMapper::areaEntityToAreaResponse)
                .toList();
    }
}
