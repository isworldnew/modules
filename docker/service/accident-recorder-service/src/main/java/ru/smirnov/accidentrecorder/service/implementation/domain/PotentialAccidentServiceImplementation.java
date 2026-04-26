package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.config.AccidentStorageMinioBuckets;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;
import ru.smirnov.accidentrecorder.file.abstraction.RecordProcessor;
import ru.smirnov.accidentrecorder.message.AccidentMessage;
import ru.smirnov.accidentrecorder.service.abstraction.domain.PotentialAccidentService;
import ru.smirnov.accidentrecorder.service.abstraction.minio.AccidentStorageClient;
import ru.smirnov.accidentrecorder.service.abstraction.minio.EntryRecordStorageClient;
import ru.smirnov.accidentrecorder.service.abstraction.mongo.DetectedPersonService;
import ru.smirnov.accidentrecorder.util.AccidentIgnoringCriteria;

import java.io.InputStream;
import java.util.UUID;

@Service
public class PotentialAccidentServiceImplementation implements PotentialAccidentService {

    private final AccidentIgnoringCriteria accidentIgnoringCriteria;
    private final DetectedPersonService detectedPersonService;

    private final EntryRecordStorageClient entryRecordStorageClient;
    private final AccidentStorageClient accidentStorageClient;

    private final RecordProcessor recordProcessor;


    @Autowired
    public PotentialAccidentServiceImplementation(
            AccidentIgnoringCriteria accidentIgnoringCriteria,
            DetectedPersonService detectedPersonService,
            EntryRecordStorageClient entryRecordStorageClient,
            AccidentStorageClient accidentStorageClient,
            RecordProcessor recordProcessor
    ) {
        this.accidentIgnoringCriteria = accidentIgnoringCriteria;
        this.detectedPersonService = detectedPersonService;
        this.entryRecordStorageClient = entryRecordStorageClient;
        this.accidentStorageClient = accidentStorageClient;
        this.recordProcessor = recordProcessor;
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

        // запросить видос из MinIO
        InputStream originalRecord = this.entryRecordStorageClient.downloadRecord(detectedPerson.getRecordReference());

        // обрезать видео и добавить bounding boxes по треку
        InputStream croppedRecord = this.recordProcessor.cropRecordWithBoundingBoxes(originalRecord, detectedPerson);

        String fileName = UUID.randomUUID().toString() + ".mp4";

        // сохранить видос (возможно стоит имя задать просто UUID)
        this.accidentStorageClient.saveRecord(
                AccidentStorageMinioBuckets.ACCIDENTS.getBucketName(),
                fileName,
                croppedRecord,
                "video/mp4"
        );

        // сохранить инцидент в БД

    }

}
