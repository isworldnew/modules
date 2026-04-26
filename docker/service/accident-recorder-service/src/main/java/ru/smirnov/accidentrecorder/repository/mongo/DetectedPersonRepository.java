package ru.smirnov.accidentrecorder.repository.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;

public interface DetectedPersonRepository extends MongoRepository<DetectedPerson, String> {
}
