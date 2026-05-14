package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.dto.request.ResponseCreationRequest;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.ReportStatus;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.entity.domain.Response;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;
import ru.smirnov.accidentrecorder.mapper.abstraction.ResponseMapper;
import ru.smirnov.accidentrecorder.precondition.abstraction.AccidentReportPreconditionService;
import ru.smirnov.accidentrecorder.precondition.abstraction.TrespasserPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.AccidentReportRepository;
import ru.smirnov.accidentrecorder.repository.domain.ResponseRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.ResponseService;
import ru.smirnov.accidentrecorder.service.abstraction.domain.TrespasserService;

@Service
public class ResponseServiceImplementation implements ResponseService {

    private final ResponseRepository responseRepository;
    private final TrespasserService trespasserService;
    private final TrespasserPreconditionService trespasserPreconditionService;
    private final AccidentReportPreconditionService accidentReportPreconditionService;
    private final ResponseMapper responseMapper;
    private final AccidentReportRepository accidentReportRepository;

    @Autowired
    public ResponseServiceImplementation(
            ResponseRepository responseRepository,
            TrespasserService trespasserService,
            TrespasserPreconditionService trespasserPreconditionService,
            AccidentReportPreconditionService accidentReportPreconditionService,
            ResponseMapper responseMapper,
            AccidentReportRepository accidentReportRepository
    ) {
        this.responseRepository = responseRepository;
        this.trespasserService = trespasserService;
        this.trespasserPreconditionService = trespasserPreconditionService;
        this.accidentReportPreconditionService = accidentReportPreconditionService;
        this.responseMapper = responseMapper;
        this.accidentReportRepository = accidentReportRepository;
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Long createResponse(Long accidentReportId, ResponseCreationRequest dto) {
        AccidentReport accidentReport = this.accidentReportPreconditionService.safelyGetById(accidentReportId);

        Trespasser trespasser = null;

        if (dto.getTrespasserId() != null && dto.getTrespasser() == null)
            trespasser = this.trespasserPreconditionService.safelyGetById(dto.getTrespasserId());

        if (dto.getTrespasserId() == null && dto.getTrespasser() != null)
            trespasser = this.trespasserService.createTrespasser(dto.getTrespasser());

        if (dto.getTrespasserId() == null && dto.getTrespasser() == null)
            trespasser = null;

        Response response = this.responseMapper.generateAccidentResponse(dto, accidentReport, trespasser);

        this.responseRepository.save(response);

        accidentReport.setReportStatus(ReportStatus.PROCESSED_BY_FOREMAN);
        this.accidentReportRepository.save(accidentReport);

        return response.getId();
    }

}
