package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;
import ru.smirnov.accidentrecorder.message.AccidentMessage;

public interface PotentialAccidentMapper {
    PotentialAccident bunchOfDataToPotentialAccidentEntity(
            AccidentMessage accidentMessage,
            DetectedPerson detectedPerson,
            String recordReference
    );
}
