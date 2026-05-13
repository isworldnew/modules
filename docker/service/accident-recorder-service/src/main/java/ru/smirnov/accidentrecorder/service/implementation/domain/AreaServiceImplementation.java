package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.AreaPreconditionService;
import ru.smirnov.accidentrecorder.precondition.abstraction.UserPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AreaRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AreaService;

import java.util.List;

@Service
public class AreaServiceImplementation implements AreaService {

    private final AreaPreconditionService areaPreconditionService;
    private final AreaRepository areaRepository;
//    private final AreaMapper areaMapper;
    private final UserPreconditionService userPreconditionService;

    @Autowired
    public AreaServiceImplementation(
            AreaPreconditionService areaPreconditionService,
            AreaRepository areaRepository,
//            AreaMapper areaMapper,
            UserPreconditionService userPreconditionService
    ) {
        this.areaPreconditionService = areaPreconditionService;
        this.areaRepository = areaRepository;
//        this.areaMapper = areaMapper;
        this.userPreconditionService = userPreconditionService;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Long createArea(AreaCreationRequest dto) {
//        this.areaPreconditionService.checkAreaExistenceByName(dto.getName());
//
//        Area area = this.areaMapper.generateAreaEntityByAreaResponse(dto);
//        this.areaRepository.save(area);
//
//        Long foremanId = dto.getForemanId();
//        Set<Long> safetyOfficersId = dto.getSafetyOfficersId();
//
//        if (foremanId != null && (safetyOfficersId != null && !safetyOfficersId.isEmpty())) {
//            User foreman = this.userPreconditionService.safelyGetById(foremanId);
//            if (!foreman.getRole().equals(Role.FOREMAN))
//                throw new ConflictException("User with id=" + foremanId + " hasn't role = 'FOREMAN'");
//
//            List<User> safetyOfficers = safetyOfficersId.stream()
//                    .map(this.userPreconditionService::safelyGetById)
//                    .peek(safetOfficer -> {
//                        if (!safetOfficer.getRole().equals(Role.SAFETY_OFFICER))
//                            throw new ConflictException("User with id=" + safetOfficer.getId() + " hasn't role = 'SAFETY_OFFICER'");
//                    })
//                    .toList();
//
//            List<OperatedArea> operators = safetyOfficers.stream()
//                    .map(safetyOfficer -> this.operatedAreaMapper.createOperatedArea(foreman, safetyOfficer, area))
//                    .toList();
//
//        }
//
//        return area.getId();
        return null;
    }

    @Override
    public List<AreaShortcutResponse> getAreaShortcuts() {
//        List<Area> areas = this.areaRepository.findAll();
//
//        return areas.stream()
//                .map(this.areaMapper::areaEntityToAreaShortcutResponse)
//                .collect(Collectors.toList());
        return null;
    }

    @Override
    public AreaResponse getAreaById(Long id) {
//        Area area = this.areaPreconditionService.safelyGetAreaById(id);
//        return this.areaMapper.areaEntityToAreaResponse(area);
        return null;
    }

    @Override
    public Area getAreaByForemanId(Long foremanId) {
        return this.areaRepository.getAreaByForemanId(foremanId).orElseThrow(
                () -> new NotFoundException("No area found operated by foreman (user) id=" + foremanId)
        );
    }
}
