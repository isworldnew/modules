package ru.smirnov.accidentrecorder.precondition.abstraction;

import ru.smirnov.accidentrecorder.entity.domain.Response;

public interface ResponsePreconditionService {

    Response safelyGetById(Long id);

    Response safelyGetByAccidentReportId(Long accidentReportId);
}
