package ru.smirnov.accidentrecorder.service.abstraction.mongo;

import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;

public interface DetectedPersonService {
    DetectedPerson findDetectedPersonById(String objectId);
}
