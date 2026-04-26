package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.message.AccidentMessage;

public interface PotentialAccidentService {
    void processPotentialAccident(AccidentMessage accidentMessage);
}
