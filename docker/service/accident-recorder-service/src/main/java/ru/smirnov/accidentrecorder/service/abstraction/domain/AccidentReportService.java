package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.ReportRequest;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentReportShortcutResponse;

import java.time.OffsetDateTime;
import java.util.List;

public interface AccidentReportService {

    Long saveAccidentReport(DataForToken tokenData, Long id, ReportRequest dto);

    List<AccidentReportShortcutResponse> getAccidentReportShortcuts(
            DataForToken tokenData,
            Long areaId,
            String reportStatus,
            OffsetDateTime dateFrom,
            OffsetDateTime dateTo
    );

    Integer getUnprocessedAccidentReportsAmount(DataForToken tokenData);

    List<AccidentReportShortcutResponse> getProcessedAccidentReportShortcutsByDocumentedStatus(
            DataForToken tokenData,
            Long areaId,
            String documented,
            OffsetDateTime dateFrom,
            OffsetDateTime dateTo
    );

    List<AccidentReportShortcutResponse> getDocumentedEventsByTrespasserId(Long trespasserId);
}
