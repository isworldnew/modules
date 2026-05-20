package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.ReportRequest;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.*;
import ru.smirnov.accidentrecorder.entity.domain.AccidentReport;
import ru.smirnov.accidentrecorder.entity.domain.Area;
import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;
import ru.smirnov.accidentrecorder.exception.ForbiddenException;
import ru.smirnov.accidentrecorder.precondition.abstraction.AreaPreconditionService;
import ru.smirnov.accidentrecorder.precondition.abstraction.PotentialAccidentPreconditionService;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentReportShortcutResponse;
import ru.smirnov.accidentrecorder.repository.domain.AccidentReportRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AccidentReportService;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AreaService;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AccidentReportServiceImplementation implements AccidentReportService {

    private final AccidentReportRepository accidentReportRepository;
    private final PotentialAccidentPreconditionService potentialAccidentPreconditionService;
    private final AreaService areaService;
    private final AreaPreconditionService areaPreconditionService;

    @Autowired
    public AccidentReportServiceImplementation(
            AccidentReportRepository accidentReportRepository,
            PotentialAccidentPreconditionService potentialAccidentPreconditionService,
            AreaService areaService,
            AreaPreconditionService areaPreconditionService
    ) {
        this.accidentReportRepository = accidentReportRepository;
        this.potentialAccidentPreconditionService = potentialAccidentPreconditionService;
        this.areaService = areaService;
        this.areaPreconditionService = areaPreconditionService;
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

        if (accidentReport.getAccidentInterpretation() == AccidentInterpretation.FALSE_ALARM)
            accidentReport.setReportStatus(ReportStatus.PROCESSED_BY_FOREMAN);

        potentialAccident.setStatus(AccidentStatus.PROCESSED);

        this.accidentReportRepository.save(accidentReport);

        return accidentReport.getId();
    }

    @Override
    public List<AccidentReportShortcutResponse> getAccidentReportShortcuts(
            DataForToken tokenData,
            Long areaId,
            String reportStatus,
            OffsetDateTime dateFrom,
            OffsetDateTime dateTo
    ) {
        /*
             Метод для роли FOREMAN
             Можно использовать для уведомлений или архива: вернёт то, что относится к Area данного Foreman

             И метод для роли SUPERVISOR
             В архиве используется для просмотра полностью обработанных инцидентов
        */

        Area operatedArea = null;

        if (Role.valueOf(tokenData.getRole()).equals(Role.FOREMAN))
            operatedArea = this.areaService.getAreaByForemanId(tokenData.getUserId());

        ReportStatus statusOfReport = ReportStatus.valueOf(reportStatus.toUpperCase());

        List<AccidentReportShortcutResponse> accidentReportShortcuts = new ArrayList<>();

        // для уведомлений
        // уведомления только у FOREMAN
        if (statusOfReport == ReportStatus.UNPROCESSED_BY_FOREMAN && Role.valueOf(tokenData.getRole()).equals(Role.FOREMAN))
            return this.accidentReportRepository.getUnprocessedAccidentReportsByAreaId(operatedArea.getId());

        // для архива
        // тут архив либо FOREMAN-а, либо SUPERVISOR-а
        if (statusOfReport == ReportStatus.PROCESSED_BY_FOREMAN) {

            if (dateFrom == null && dateTo == null) {
                dateTo = OffsetDateTime.now();
                dateFrom = dateTo.minusDays(3);
            }

            if (Role.valueOf(tokenData.getRole()).equals(Role.FOREMAN))
                return this.accidentReportRepository.getProcessedAccidentReportsByAreaIdAndDateTimeRange(operatedArea.getId(), dateFrom, dateTo);

            else {
                if (areaId != null) {
                    Area area = this.areaPreconditionService.safelyGetById(areaId);

                    return this.accidentReportRepository.getProcessedAccidentReportsByAreaIdAndDateTimeRange(areaId, dateFrom, dateTo);
                }

                return this.accidentReportRepository.getProcessedAccidentReportsByDateTimeRange(dateFrom, dateTo);
            }
        }

        return accidentReportShortcuts;
    }

    @Override
    public Integer getUnprocessedAccidentReportsAmount(DataForToken tokenData) {
        return this.getAccidentReportShortcuts(
                tokenData,
                null,
                ReportStatus.UNPROCESSED_BY_FOREMAN.name(),
                null, null
        ).size();
    }

}
