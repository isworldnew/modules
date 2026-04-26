package ru.smirnov.accidentrecorder.service.implementation.mongo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.repository.mongo.DetectedPersonRepository;
import ru.smirnov.accidentrecorder.service.abstraction.mongo.DetectedPersonService;

@Service
public class DetectedPersonServiceImplementation implements DetectedPersonService {

    private final DetectedPersonRepository detectedPersonRepository;

    @Autowired
    public DetectedPersonServiceImplementation(DetectedPersonRepository detectedPersonRepository) {
        this.detectedPersonRepository = detectedPersonRepository;
    }

    @Override
    public DetectedPerson findDetectedPersonById(String objectId) {
        return this.detectedPersonRepository.findById(objectId).orElseThrow(
                () -> new NotFoundException("Record with objectId=" + objectId + " was not found")
        );
    }
}
