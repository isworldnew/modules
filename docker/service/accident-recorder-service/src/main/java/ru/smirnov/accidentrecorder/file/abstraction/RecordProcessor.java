package ru.smirnov.accidentrecorder.file.abstraction;

import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;

import java.io.InputStream;

public interface RecordProcessor {
    InputStream cropRecordWithBoundingBoxes(InputStream originalRecord, DetectedPerson detectedPerson);
}
