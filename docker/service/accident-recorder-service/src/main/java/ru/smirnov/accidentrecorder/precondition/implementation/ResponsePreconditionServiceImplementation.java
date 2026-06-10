package ru.smirnov.accidentrecorder.precondition.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.entity.domain.Response;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.ResponsePreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.ResponseRepository;

@Service
public class ResponsePreconditionServiceImplementation implements ResponsePreconditionService {

    private final ResponseRepository responseRepository;

    @Autowired
    public ResponsePreconditionServiceImplementation(ResponseRepository responseRepository) {
        this.responseRepository = responseRepository;
    }

    @Override
    public Response safelyGetById(Long id) {
        return this.responseRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Response with id=" + id + " doesn't exist")
        );
    }

    @Override
    public Response safelyGetByAccidentReportId(Long accidentReportId) {
        return this.responseRepository.findByAccidentReportId(accidentReportId).orElseThrow(
                () -> new NotFoundException("Response not found for accident_report_id: " + accidentReportId)
        );
    }
}