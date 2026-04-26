package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;
import ru.smirnov.accidentrecorder.message.AccidentMessage;
import ru.smirnov.accidentrecorder.service.abstraction.domain.PotentialAccidentService;
import ru.smirnov.accidentrecorder.service.abstraction.mongo.DetectedPersonService;
import ru.smirnov.accidentrecorder.util.AccidentIgnoringCriteria;

@Service
public class PotentialAccidentServiceImplementation implements PotentialAccidentService {

    private final AccidentIgnoringCriteria accidentIgnoringCriteria;
    private final DetectedPersonService detectedPersonService;

    @Autowired
    public PotentialAccidentServiceImplementation(
            AccidentIgnoringCriteria accidentIgnoringCriteria,
            DetectedPersonService detectedPersonService
    ) {
        this.accidentIgnoringCriteria = accidentIgnoringCriteria;
        this.detectedPersonService = detectedPersonService;
    }

    @Override
    // @Transactional
    public void processPotentialAccident(AccidentMessage accidentMessage) {

        if (this.accidentIgnoringCriteria.ignore(
                accidentMessage.getVestClassificationResult(),
                accidentMessage.getAverageConfidence()
        )) {
            System.out.println("[IGNORED]: " + accidentMessage);
            return;
        }

        DetectedPerson detectedPerson = this.detectedPersonService.findDetectedPersonById(accidentMessage.getObjectId());

        System.out.println(detectedPerson);

    }

}
