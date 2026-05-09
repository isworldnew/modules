package ru.smirnov.accidentrecorder.precondition.abstraction;

import ru.smirnov.accidentrecorder.entity.domain.Area;

public interface AreaPreconditionService {

    void checkAreaExistenceByName(String name);

    Area safelyGetAreaById(Long id);

}
