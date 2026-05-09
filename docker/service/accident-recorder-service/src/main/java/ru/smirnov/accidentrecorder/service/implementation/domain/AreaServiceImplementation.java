package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.mapper.abstraction.AreaMapper;
import ru.smirnov.accidentrecorder.precondition.abstraction.AreaPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AreaRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AreaService;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AreaServiceImplementation implements AreaService {

    private final AreaPreconditionService areaPreconditionService;
    private final AreaRepository areaRepository;
    private final AreaMapper areaMapper;

    @Autowired
    public AreaServiceImplementation(AreaPreconditionService areaPreconditionService, AreaRepository areaRepository, AreaMapper areaMapper) {
        this.areaPreconditionService = areaPreconditionService;
        this.areaRepository = areaRepository;
        this.areaMapper = areaMapper;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Long createArea(AreaCreationRequest dto) {
        this.areaPreconditionService.checkAreaExistenceByName(dto.getName());

        Area area = this.areaMapper.generateAreaEntityByAreaResponse(dto);
        this.areaRepository.save(area);

        return area.getId();
    }

    @Override
    public List<AreaShortcutResponse> getAreaShortcuts() {
        List<Area> areas = this.areaRepository.findAll();

        return areas.stream()
                .map(this.areaMapper::areaEntityToAreaShortcutResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AreaResponse getAreaById(Long id) {
        Area area = this.areaPreconditionService.safelyGetAreaById(id);
        return this.areaMapper.areaEntityToAreaResponse(area);
    }

}
