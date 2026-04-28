package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.ReportRequest;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentInterpretation;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentStatus;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.AccidentType;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;
import ru.smirnov.accidentrecorder.exception.ForbiddenException;
import ru.smirnov.accidentrecorder.precondition.abstraction.PotentialAccidentPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AccidentReportRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AccidentReportService;

@Service
public class AccidentReportServiceImplementation implements AccidentReportService {

    private final AccidentReportRepository accidentReportRepository;
    private final PotentialAccidentPreconditionService potentialAccidentPreconditionService;

    @Autowired
    public AccidentReportServiceImplementation(
            AccidentReportRepository accidentReportRepository,
            PotentialAccidentPreconditionService potentialAccidentPreconditionService
    ) {
        this.accidentReportRepository = accidentReportRepository;
        this.potentialAccidentPreconditionService = potentialAccidentPreconditionService;
    }

    @Override
    @Transactional(isolation = Isolation.DEFAULT)
    public Long saveAccidentReport(DataForToken tokenData, Long id, ReportRequest dto) {
        PotentialAccident potentialAccident = this.potentialAccidentPreconditionService.safelyGetPotentialAccidentById(id);

        if (!potentialAccident.getSafetyOfficer().getId().equals(tokenData.getUserId()))
            throw new ForbiddenException("Potential Accident Record with id=" + id + " is not appointed to Safety Officer with id=" + tokenData.getUserId());

        AccidentReport accidentReport = new AccidentReport();

        accidentReport.setAccident(potentialAccident);
        accidentReport.setAccidentType(AccidentType.valueOf(dto.getType()));
        accidentReport.setAccidentInterpretation(AccidentInterpretation.valueOf(dto.getInterpretation()));
        accidentReport.setDescription(dto.getDescription());

        potentialAccident.setStatus(AccidentStatus.PROCESSED);

        this.accidentReportRepository.save(accidentReport);

        return accidentReport.getId();
    }

}
