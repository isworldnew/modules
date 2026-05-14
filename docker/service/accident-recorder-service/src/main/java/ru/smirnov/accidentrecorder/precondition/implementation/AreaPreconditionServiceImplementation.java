package ru.smirnov.accidentrecorder.precondition.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.AreaPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AreaRepository;

import java.util.Optional;

@Service
public class AreaPreconditionServiceImplementation implements AreaPreconditionService {

    private final AreaRepository areaRepository;

    @Autowired
    public AreaPreconditionServiceImplementation(AreaRepository areaRepository) {
        this.areaRepository = areaRepository;
    }

    @Override
    public Optional<Area> safelyGetByName(String name) {
        return this.areaRepository.getAreaByName(name);
    }

    @Override
    public Area safelyGetById(Long id) {
        return this.areaRepository.findById(id).orElseThrow(
                () -> new NotFoundException("No area with id=" + id + " found")
        );
    }
}
