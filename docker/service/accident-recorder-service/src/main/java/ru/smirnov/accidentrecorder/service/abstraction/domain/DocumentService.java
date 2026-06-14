package ru.smirnov.accidentrecorder.service.abstraction.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import ru.smirnov.accidentrecorder.dto.request.DocumentCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.DocumentResponse;
import ru.smirnov.accidentrecorder.entity.domain.Response;

import java.time.OffsetDateTime;
import java.util.List;

public interface DocumentService {
    Long addDocumentPerResponse(DocumentCreationRequest dto);

    DocumentResponse getDocumentByAccidentReportId(Long accidentReportId);

    DocumentResponse getDocumentByAccidentId(Long accidentId);

    List<DocumentResponse> getDocumentsByDateTimeRange(OffsetDateTime dateFrom, OffsetDateTime dateTo);
}
