package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.dto.request.ResponseCreationRequest;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.entity.domain.Response;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;

public interface ResponseMapper {

    Response generateAccidentResponse(ResponseCreationRequest dto, AccidentReport accidentReport, Trespasser trespasser);

}
