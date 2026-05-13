package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.dto.request.TrespasserCreationRequest;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;

public interface TrespasserService {
    Trespasser createTrespasser(TrespasserCreationRequest dto);
}
