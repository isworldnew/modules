package ru.smirnov.accidentrecorder.precondition.abstraction;

import ru.smirnov.accidentrecorder.entity.domain.Trespasser;

public interface TrespasserPreconditionService {

    Trespasser safelyGetById(Long id);
}
