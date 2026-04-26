package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.message.AccidentMessage;
import ru.smirnov.accidentrecorder.service.abstraction.domain.PotentialAccidentService;
import ru.smirnov.accidentrecorder.util.AccidentIgnoringCriteria;

@Service
public class PotentialAccidentServiceImplementation implements PotentialAccidentService {

    private final AccidentIgnoringCriteria accidentIgnoringCriteria;

    @Autowired
    public PotentialAccidentServiceImplementation(AccidentIgnoringCriteria accidentIgnoringCriteria) {
        this.accidentIgnoringCriteria = accidentIgnoringCriteria;
    }

    @Override
    // @Transactional
    public void processPotentialAccident(AccidentMessage accidentMessage) {

    }

}
