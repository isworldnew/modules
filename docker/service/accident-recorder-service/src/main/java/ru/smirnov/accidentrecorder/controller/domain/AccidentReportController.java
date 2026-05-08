package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.ReportRequest;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AccidentReportService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;

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

}
