package ru.smirnov.accidentrecorder.precondition.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.exception.ConflictException;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.AreaPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AreaRepository;

@Component
public class AreaPreconditionServiceImplementation implements AreaPreconditionService {

    private final AreaRepository areaRepository;

    @Autowired
    public AreaPreconditionServiceImplementation(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    @Override
    public void checkAreaExistenceByName(String name) {
        boolean exists = this.areaRepository.findAll().stream()
                .map(Area::getName)
                .anyMatch(areaName -> areaName.equalsIgnoreCase(name.trim()));

        if (exists) throw new ConflictException("Area with name = '" + name + "' already exists");
    }

    @Override
    public Area safelyGetAreaById(Long id) {
        return this.areaRepository.findById(id).orElseThrow(
                () -> new NotFoundException("No area with id=" + id)
        );
    }

}
