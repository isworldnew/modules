package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.ReportRequest;

public interface AccidentReportService {

    Long saveAccidentReport(DataForToken tokenData, Long id, ReportRequest dto);
}
