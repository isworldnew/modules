package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.response.AccidentShortcutResponse;
import ru.smirnov.accidentrecorder.message.AccidentMessage;

import java.time.OffsetDateTime;
import java.util.List;

public interface PotentialAccidentService {

    void processPotentialAccidentMessage(AccidentMessage accidentMessage);

    Integer getUnprocessedPotentialAccidentsAmount(DataForToken tokenData);

    List<AccidentShortcutResponse> getAccidentShortcutsByStatus(
            DataForToken tokenData,
            String status,
            OffsetDateTime dateFrom,
            OffsetDateTime dateTo
    );
}
