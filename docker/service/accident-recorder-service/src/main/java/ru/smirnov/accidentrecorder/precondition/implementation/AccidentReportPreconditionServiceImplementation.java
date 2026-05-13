package ru.smirnov.accidentrecorder.precondition.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.AccidentReportPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AccidentReportRepository;

@Component
public class AccidentReportPreconditionServiceImplementation implements AccidentReportPreconditionService {

    private final AccidentReportRepository accidentReportRepository;

    @Autowired
    public AccidentReportPreconditionServiceImplementation(AccidentReportRepository accidentReportRepository) {
        this.accidentReportRepository = accidentReportRepository;
    }

    @Override
    public AccidentReport safelyGetById(Long id) {
        return this.accidentReportRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Accident Report with id=" + id + " was not found")
        );
    }
}
