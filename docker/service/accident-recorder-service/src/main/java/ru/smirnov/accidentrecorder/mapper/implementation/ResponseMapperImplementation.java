package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.request.ResponseCreationRequest;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentedResponse;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.ResponseType;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.entity.domain.Response;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;
import ru.smirnov.accidentrecorder.mapper.abstraction.ResponseMapper;

@Component
public class ResponseMapperImplementation implements ResponseMapper {

    @Override
    public Response generateAccidentResponse(ResponseCreationRequest dto, AccidentReport accidentReport, Trespasser trespasser) {
        Response response = new Response();

        response.setResponseType(ResponseType.valueOf(dto.getResponseType().toUpperCase()));
        response.setResponseReport(dto.getResponseReport());
        response.setTrespasser(trespasser);
        response.setAccidentReport(accidentReport);
        response.setDocumentedResponse(DocumentedResponse.NON_DOCUMENTED);

        return response;
    }
}
