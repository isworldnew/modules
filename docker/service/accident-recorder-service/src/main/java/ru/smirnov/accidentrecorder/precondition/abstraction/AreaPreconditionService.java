package ru.smirnov.accidentrecorder.precondition.abstraction;

import ru.smirnov.accidentrecorder.entity.domain.Area;

import java.util.Optional;

public interface AreaPreconditionService {

    Optional<Area> safelyGetByName(String name);

    Area safelyGetById(Long id);
}
