package ru.smirnov.accidentrecorder.precondition.abstraction;

import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;

public interface AccidentReportPreconditionService {

    AccidentReport safelyGetById(Long id);
}
