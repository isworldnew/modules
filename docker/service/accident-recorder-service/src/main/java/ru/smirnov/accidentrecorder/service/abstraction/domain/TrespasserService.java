package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.dto.request.TrespasserCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.TrespasserShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;

import java.util.List;

public interface TrespasserService {
    Trespasser createTrespasser(TrespasserCreationRequest dto);

    List<TrespasserShortcutResponse> trespassersSearch(String searchRequest);
}
