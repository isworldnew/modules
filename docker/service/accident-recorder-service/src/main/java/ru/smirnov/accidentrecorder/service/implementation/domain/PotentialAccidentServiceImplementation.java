package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.config.AccidentStorageMinioBuckets;
import ru.smirnov.accidentrecorder.dto.response.AccidentResponse;
import ru.smirnov.accidentrecorder.exception.ForbiddenException;
import ru.smirnov.accidentrecorder.precondition.abstraction.PotentialAccidentPreconditionService;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentShortcutResponse;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.Role;
import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;
import ru.smirnov.accidentrecorder.entity.mongo.DetectedPerson;
import ru.smirnov.accidentrecorder.file.abstraction.RecordProcessor;
import ru.smirnov.accidentrecorder.mapper.abstraction.PotentialAccidentMapper;
import ru.smirnov.accidentrecorder.message.AccidentMessage;
import ru.smirnov.accidentrecorder.repository.domain.PotentialAccidentRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.PotentialAccidentService;
import ru.smirnov.accidentrecorder.service.abstraction.minio.AccidentStorageClient;
import ru.smirnov.accidentrecorder.service.abstraction.minio.EntryRecordStorageClient;
import ru.smirnov.accidentrecorder.service.abstraction.mongo.DetectedPersonService;
import ru.smirnov.accidentrecorder.service.abstraction.util.AccidentIgnoringCriteria;
import ru.smirnov.accidentrecorder.service.abstraction.util.SafetyOfficerAppointmentCriteria;

import java.io.InputStream;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PotentialAccidentServiceImplementation implements PotentialAccidentService {

    private final AccidentIgnoringCriteria accidentIgnoringCriteria;
    private final DetectedPersonService detectedPersonService;

    private final EntryRecordStorageClient entryRecordStorageClient;
    private final AccidentStorageClient accidentStorageClient;

    private final RecordProcessor recordProcessor;

    private final PotentialAccidentRepository potentialAccidentRepository;
    private final PotentialAccidentMapper potentialAccidentMapper;

    private final SafetyOfficerAppointmentCriteria safetyOfficerAppointmentCriteria;

    private final PotentialAccidentPreconditionService potentialAccidentPreconditionService;


    @Autowired
    public PotentialAccidentServiceImplementation(
            AccidentIgnoringCriteria accidentIgnoringCriteria,
            DetectedPersonService detectedPersonService,
            EntryRecordStorageClient entryRecordStorageClient,
            AccidentStorageClient accidentStorageClient,
            RecordProcessor recordProcessor,
            PotentialAccidentRepository potentialAccidentRepository,
            PotentialAccidentMapper potentialAccidentMapper,
            SafetyOfficerAppointmentCriteria safetyOfficerAppointmentCriteria,
            PotentialAccidentPreconditionService potentialAccidentPreconditionService
    ) {
        this.accidentIgnoringCriteria = accidentIgnoringCriteria;
        this.detectedPersonService = detectedPersonService;
        this.entryRecordStorageClient = entryRecordStorageClient;
        this.accidentStorageClient = accidentStorageClient;
        this.recordProcessor = recordProcessor;
        this.potentialAccidentRepository = potentialAccidentRepository;
        this.potentialAccidentMapper = potentialAccidentMapper;
        this.safetyOfficerAppointmentCriteria = safetyOfficerAppointmentCriteria;
        this.potentialAccidentPreconditionService = potentialAccidentPreconditionService;
    }

    @Override
    // @Transactional
    public void processPotentialAccidentMessage(AccidentMessage accidentMessage) {

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
        this.createPotentialAccidentRecord(accidentMessage, detectedPerson, fileName);
    }

    @Transactional
    private PotentialAccident createPotentialAccidentRecord(
            AccidentMessage accidentMessage,
            DetectedPerson detectedPerson,
            String recordReference
    ) {
        Long safetyOfficerId = this.safetyOfficerAppointmentCriteria.appoint();
        PotentialAccident potentialAccident = this.potentialAccidentMapper.bunchOfDataToPotentialAccidentEntity(
                accidentMessage, detectedPerson, recordReference, safetyOfficerId
        );
        this.potentialAccidentRepository.save(potentialAccident);
        return potentialAccident;
    }

    @Override
    public Integer getUnprocessedPotentialAccidentsAmount(DataForToken tokenData) {
        Long safetyOfficerId = tokenData.getUserId();
        return this.potentialAccidentRepository.countUnprocessedPotentialAccidentsBySafetyOfficerId(safetyOfficerId);
    }

    @Override
    public List<AccidentShortcutResponse> getAccidentShortcutsByStatus(
            DataForToken tokenData,
            String status,
            OffsetDateTime dateFrom,
            OffsetDateTime dateTo
    ) {
        if (dateFrom == null && dateTo == null) {
            dateTo = OffsetDateTime.now();
            dateFrom = dateTo.minusDays(3);
        }

        Role role = Role.valueOf(tokenData.getRole());

        // если SAFETY_OFFICER, то только те, которые назначены на него
        if (role == Role.SAFETY_OFFICER)
            return this.potentialAccidentRepository.getPotentialAccidentShortcutsBySafetyOfficerId(
                    status.toUpperCase(),
                    tokenData.getUserId(),
                    dateFrom,
                    dateTo
            );

        // если SUPERVISOR, ADMIN, SUPERADMIN: возвращаем все
        else
            return this.potentialAccidentRepository.getPotentialAccidentShortcuts(
                    status.toUpperCase(),
                    dateFrom,
                    dateTo
            );
    }

    @Override
    public AccidentResponse getAccidentById(DataForToken tokenData, Long id) {

        PotentialAccident potentialAccident = this.potentialAccidentPreconditionService.safelyGetPotentialAccidentById(id);

        Role role = Role.valueOf(tokenData.getRole());

        // если SAFETY_OFFICER, то может читать только те, которые назначены на него
        if (role == Role.SAFETY_OFFICER) {
            if (!potentialAccident.getSafetyOfficer().getId().equals(tokenData.getUserId()))
                throw new ForbiddenException("Potential Accident Record with id=" + id + " is not appointed to Safety Officer with id=" + tokenData.getUserId());
        }

        // если FOREMAN, SUPERVISOR, ADMIN, SUPERADMIN - читать могут всё

        return this.potentialAccidentMapper.potentialAccidentEntityToAccidentResponse(potentialAccident);
    }
}
