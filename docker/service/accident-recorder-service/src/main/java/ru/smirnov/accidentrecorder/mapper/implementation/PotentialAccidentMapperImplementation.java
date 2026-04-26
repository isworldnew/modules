package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;
import ru.smirnov.accidentrecorder.mapper.abstraction.PotentialAccidentMapper;
import ru.smirnov.accidentrecorder.message.AccidentMessage;

@Component
public class PotentialAccidentMapperImplementation implements PotentialAccidentMapper {

    @Override
    public PotentialAccident bunchOfDataToPotentialAccidentEntity(
            AccidentMessage accidentMessage,
            DetectedPerson detectedPerson,
            String recordReference
    ) {

    }

}
