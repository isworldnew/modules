package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.entity.relation.OperatedArea;
import ru.smirnov.accidentrecorder.mapper.abstraction.OperatedAreaMapper;
import ru.smirnov.accidentrecorder.repository.relation.OperatedAreaRepository;

@Component
public class OperatedAreaMapperImplementation implements OperatedAreaMapper {

    private final OperatedAreaRepository operatedAreaRepository;

    @Autowired
    public OperatedAreaMapperImplementation(OperatedAreaRepository operatedAreaRepository) {
        this.operatedAreaRepository = operatedAreaRepository;
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public OperatedArea createOperatedArea(User foreman, User safetyOfficer, Area area) {
        OperatedArea operatedArea = new OperatedArea();
        operatedArea.setForeman(foreman);
        operatedArea.setSafetyOfficer(safetyOfficer);
        operatedArea.setArea(area);

        this.operatedAreaRepository.save(operatedArea);
        return operatedArea;
    }

}
