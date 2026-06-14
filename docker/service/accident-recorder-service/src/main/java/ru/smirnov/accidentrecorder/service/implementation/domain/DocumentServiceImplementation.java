package ru.smirnov.accidentrecorder.service.implementation.domain;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.config.AccidentStorageMinioBuckets;
import ru.smirnov.accidentrecorder.dto.request.DocumentCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.DocumentResponse;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentType;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentedResponse;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.entity.domain.Document;
import ru.smirnov.accidentrecorder.entity.domain.Response;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.mapper.abstraction.DocumentMapper;
import ru.smirnov.accidentrecorder.precondition.abstraction.ResponsePreconditionService;
import ru.smirnov.accidentrecorder.projection.abstraction.DocumentProjection;
import ru.smirnov.accidentrecorder.repository.domain.AccidentReportRepository;
import ru.smirnov.accidentrecorder.repository.domain.DocumentRepository;
import ru.smirnov.accidentrecorder.repository.domain.ResponseRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.DocumentService;
import ru.smirnov.accidentrecorder.service.abstraction.minio.AccidentStorageClient;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentServiceImplementation implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ResponseRepository responseRepository;
    private final ResponsePreconditionService responsePreconditionService;
    private final AccidentStorageClient accidentStorageClient;
    private final DocumentMapper documentMapper;
    private final AccidentReportRepository accidentReportRepository;


    @Autowired
    public DocumentServiceImplementation(
            DocumentRepository documentRepository,
            ResponseRepository responseRepository,
            ResponsePreconditionService responsePreconditionService,
            AccidentStorageClient accidentStorageClient,
            DocumentMapper documentMapper,
            AccidentReportRepository accidentReportRepository
    ) {
        this.documentRepository = documentRepository;
        this.responseRepository = responseRepository;
        this.responsePreconditionService = responsePreconditionService;
        this.accidentStorageClient = accidentStorageClient;
        this.documentMapper = documentMapper;
        this.accidentReportRepository = accidentReportRepository;
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    @SneakyThrows
    public Long addDocumentPerResponse(DocumentCreationRequest dto) {

        Response response = this.responsePreconditionService.safelyGetById(dto.getResponseId());
        response.setDocumentedResponse(DocumentedResponse.DOCUMENTED);
        this.responseRepository.save(response);

        String extension = Files.probeContentType(Paths.get(dto.getDocument().getOriginalFilename()));
        String fileName = dto.getResponseId() + "-" + UUID.randomUUID().toString() + "." + extension.split("/")[1];

        Document document = this.documentMapper.generateDocumentEntity(
                fileName,
                response,
                DocumentType.valueOf(dto.getDocumentType().toUpperCase())
        );

        this.accidentStorageClient.saveRecord(
                AccidentStorageMinioBuckets.DOCUMENTS.getBucketName(),
                fileName,
                dto.getDocument().getInputStream(),
                extension
        );

        this.documentRepository.save(document);

        return document.getId();
    }

    @Override
    @SneakyThrows
    public DocumentResponse getDocumentByAccidentReportId(Long accidentReportId) {
        Response response = this.responseRepository.findByAccidentReportId(accidentReportId)
                .orElseThrow(() -> new NotFoundException("Response not found for accident_report_id: " + accidentReportId));

        Document document = this.documentRepository.findByResponseId(response.getId())
                .orElseThrow(() -> new NotFoundException("Document not found for response id: " + response.getId()));

        byte[] content = this.accidentStorageClient.getRecordAsBytes(
                AccidentStorageMinioBuckets.DOCUMENTS.getBucketName(),
                document.getDocumentReference()
        );

        String contentType = Files.probeContentType(Paths.get(document.getDocumentReference()));
        String base64Content = Base64.getEncoder().encodeToString(content);

        return new DocumentResponse(
                base64Content,
                contentType != null ? contentType : "application/octet-stream",
                document.getDocumentReference(),
                document.getId(),
                null
        );
    }

    @Override
    @SneakyThrows
    public DocumentResponse getDocumentByAccidentId(Long accidentId) {
        AccidentReport accidentReport = accidentReportRepository.findByAccidentId(accidentId)
                .orElseThrow(() -> new NotFoundException("Accident report not found for accident id: " + accidentId));

        Response response = responseRepository.findByAccidentReportId(accidentReport.getId())
                .orElseThrow(() -> new NotFoundException("Response not found for accident_report_id: " + accidentReport.getId()));

        Document document = documentRepository.findByResponseId(response.getId())
                .orElseThrow(() -> new NotFoundException("Document not found for response id: " + response.getId()));

        byte[] content = accidentStorageClient.getRecordAsBytes(
                AccidentStorageMinioBuckets.DOCUMENTS.getBucketName(),
                document.getDocumentReference()
        );

        String contentType = Files.probeContentType(Paths.get(document.getDocumentReference()));
        String base64Content = Base64.getEncoder().encodeToString(content);

        return new DocumentResponse(
                base64Content,
                contentType != null ? contentType : "application/octet-stream",
                document.getDocumentReference(),
                document.getId(),
                null
        );
    }

    @Override
    @SneakyThrows
    public List<DocumentResponse> getDocumentsByDateTimeRange(OffsetDateTime dateFrom, OffsetDateTime dateTo) {
        if (dateFrom == null || dateTo == null) {
            dateTo = OffsetDateTime.now();
            dateFrom = dateTo.minusDays(90);
        }

        List<DocumentProjection> projections = this.documentRepository.getDocumentsByDateTimeRange(dateFrom, dateTo);

        List<DocumentResponse> responses = new ArrayList<>();

        for (DocumentProjection projection : projections) {
            byte[] content = this.accidentStorageClient.getRecordAsBytes(
                    AccidentStorageMinioBuckets.DOCUMENTS.getBucketName(),
                    projection.getDocumentReference()
            );

            String contentType = Files.probeContentType(Paths.get(projection.getDocumentReference()));
            String base64Content = Base64.getEncoder().encodeToString(content);

            responses.add(new DocumentResponse(
                    base64Content,
                    contentType != null ? contentType : "application/octet-stream",
                    projection.getDocumentReference(),
                    projection.getDocumentId(),
                    projection.getAccidentDateTime()
            ));
        }

        return responses;
    }
}
