package ru.smirnov.accidentrecorder.precondition.abstraction;

import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;

public interface PotentialAccidentPreconditionService {

    PotentialAccident safelyGetPotentialAccidentById(Long id);
}
