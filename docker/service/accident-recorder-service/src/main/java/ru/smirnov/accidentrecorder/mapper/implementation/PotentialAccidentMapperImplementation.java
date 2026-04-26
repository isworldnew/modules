package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.mapper.abstraction.PotentialAccidentMapper;
import ru.smirnov.accidentrecorder.message.AccidentMessage;
import ru.smirnov.accidentrecorder.repository.domain.AreaRepository;
import ru.smirnov.accidentrecorder.repository.domain.CameraRepository;
import ru.smirnov.accidentrecorder.util.RecordPathUtil;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Component
public class PotentialAccidentMapperImplementation implements PotentialAccidentMapper {

    private final AreaRepository areaRepository;
    private final CameraRepository cameraRepository;

    @Autowired
    public PotentialAccidentMapperImplementation(AreaRepository areaRepository, CameraRepository cameraRepository) {
        this.areaRepository = areaRepository;
        this.cameraRepository = cameraRepository;
    }

    @Override
    public PotentialAccident bunchOfDataToPotentialAccidentEntity(
            AccidentMessage accidentMessage,
            DetectedPerson detectedPerson,
            String recordReference
    ) {
        PotentialAccident potentialAccident = new PotentialAccident();

        Long areaId = RecordPathUtil.extractAreaId(detectedPerson.getRecordReference());
        potentialAccident.setArea(
                this.areaRepository.findById(areaId)
                .orElseThrow(() -> new NotFoundException("No Area with id=" + areaId))
        );

        Long cameraId = RecordPathUtil.extractCameraId(detectedPerson.getRecordReference());
        potentialAccident.setCamera(
                this.cameraRepository.findById(cameraId)
                        .orElseThrow(() -> new NotFoundException("No Camera with id=" + cameraId))
        );

        Long recordStartTimestamp = RecordPathUtil.extractTimestamp(detectedPerson.getRecordReference());
        potentialAccident.setRecordStartDateTime(
                OffsetDateTime.ofInstant(Instant.ofEpochSecond(recordStartTimestamp), ZoneOffset.UTC)
        );

        // [accident_datetime]: [record_start_datetime] + startTime из detectedPerson
        Long accidentDateTime = recordStartTimestamp + Double.valueOf(detectedPerson.getStartTime()).longValue();
        potentialAccident.setAccidentDateTime(
                OffsetDateTime.ofInstant(Instant.ofEpochSecond(accidentDateTime), ZoneOffset.UTC)
        );

        potentialAccident.setSupposedAccuracy(accidentMessage.getAverageConfidence());

        potentialAccident.setRecordReference(recordReference);

        return potentialAccident;
    }

}
