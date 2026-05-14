package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.UserPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AreaRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AreaService;


@Service
public class AreaServiceImplementation implements AreaService {

    private final AreaRepository areaRepository;
    private final UserPreconditionService userPreconditionService;

    @Autowired
    public AreaServiceImplementation(
            AreaRepository areaRepository,
            UserPreconditionService userPreconditionService
    ) {
        this.areaRepository = areaRepository;
        this.userPreconditionService = userPreconditionService;
    }

    @Override
    public Area getAreaByForemanId(Long foremanId) {
        return this.areaRepository.getAreaByForemanId(foremanId).orElseThrow(
                () -> new NotFoundException("No area found operated by foreman (user) id=" + foremanId)
        );
    }

}
