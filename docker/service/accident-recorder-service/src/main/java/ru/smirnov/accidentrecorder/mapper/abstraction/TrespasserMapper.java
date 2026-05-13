package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.dto.request.TrespasserCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.TrespasserShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;

public interface TrespasserMapper {

    Trespasser trespasserCreationRequestToTrespasserEntity(TrespasserCreationRequest dto);

    TrespasserShortcutResponse trespasserEntityToTrespasserShortcutResponse(Trespasser trespasser);
}
