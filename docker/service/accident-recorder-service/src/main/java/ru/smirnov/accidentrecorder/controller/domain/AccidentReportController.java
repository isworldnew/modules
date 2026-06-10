package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.ReportRequest;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentReportShortcutResponse;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentShortcutResponse;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AccidentReportService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;
import ru.smirnov.accidentrecorder.validation.annotation.AccidentStatusLabel;
import ru.smirnov.accidentrecorder.validation.annotation.ReportStatusLabel;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@Validated
public class AccidentReportController {

    private final SecurityContextService securityContextService;
    private final AccidentReportService accidentReportService;

    @Autowired
    public AccidentReportController(
            SecurityContextService securityContextService,
            AccidentReportService accidentReportService
    ) {
        this.securityContextService = securityContextService;
        this.accidentReportService = accidentReportService;
    }

    @PostMapping("/accident/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('SAFETY_OFFICER')")
    public void saveAccidentReport(
            @NotNull @Positive @PathVariable("id") Long id,
            @Valid @RequestBody ReportRequest dto
    ) {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        this.accidentReportService.saveAccidentReport(tokenData, id, dto);
    }

    @GetMapping("/unprocessed-amount")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('FOREMAN')")
    public Integer getUnprocessedReportsAmount() {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        return this.accidentReportService.getUnprocessedAccidentReportsAmount(tokenData);
    }

    @GetMapping("/shortcuts")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('FOREMAN', 'SUPERVISOR', 'ADMIN', 'SUPERADMIN')")
    public List<AccidentReportShortcutResponse> getReportShortcutsByStatus(
            @Positive @RequestParam(name = "areaId", required = false) Long areaId,
            @NotBlank @ReportStatusLabel @RequestParam(name = "status") String status,
            @RequestParam(name = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime dateFrom,
            @RequestParam(name = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)OffsetDateTime dateTo
    ) {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        return this.accidentReportService.getAccidentReportShortcuts(tokenData, areaId, status, dateFrom, dateTo);
    }

    @GetMapping("/event-shortcuts")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('SUPERVISOR')")
    public List<AccidentReportShortcutResponse> getEventShortcutsByDocumentedStatus(
            @RequestParam(name = "areaId", required = false) @Positive Long areaId,
            @NotBlank @RequestParam(name = "documented") String documented,
            @RequestParam(name = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime dateFrom,
            @RequestParam(name = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime dateTo
    ) {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        return this.accidentReportService.getProcessedAccidentReportShortcutsByDocumentedStatus(
                tokenData, areaId, documented, dateFrom, dateTo
        );
    }

}
