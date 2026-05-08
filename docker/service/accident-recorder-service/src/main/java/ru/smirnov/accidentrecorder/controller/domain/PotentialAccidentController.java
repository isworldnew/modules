package ru.smirnov.accidentrecorder.controller.domain;

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
import ru.smirnov.accidentrecorder.dto.response.AccidentResponse;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentShortcutResponse;
import ru.smirnov.accidentrecorder.service.abstraction.domain.PotentialAccidentService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;
import ru.smirnov.accidentrecorder.validation.annotation.AccidentStatusLabel;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/accidents")
@Validated
public class PotentialAccidentController {

    private final SecurityContextService securityContextService;
    private final PotentialAccidentService potentialAccidentService;

    @Autowired
    public PotentialAccidentController(
            SecurityContextService securityContextService,
            PotentialAccidentService potentialAccidentService
    ) {
        this.securityContextService = securityContextService;
        this.potentialAccidentService = potentialAccidentService;
    }

    // получить количество UNPROCESSED
    @GetMapping("/unprocessed-amount")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('SAFETY_OFFICER')")
    public Integer getUnprocessedPotentialAccidentsAmount() {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        return this.potentialAccidentService.getUnprocessedPotentialAccidentsAmount(tokenData);
    }

    // шорткаты UNPROCESSED или PROCESSED + по диапизону дат
    @GetMapping("/shortcuts")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN', 'SAFETY_OFFICER')")
    public List<AccidentShortcutResponse> getAccidentShortcutsByStatus(
            @NotBlank @AccidentStatusLabel @RequestParam(name = "status") String status,
            @RequestParam(name = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)OffsetDateTime dateFrom,
            @RequestParam(name = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)OffsetDateTime dateTo
    ) {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        return this.potentialAccidentService.getAccidentShortcutsByStatus(tokenData, status, dateFrom, dateTo);
    }

    // полная информация по инциденту (обработан он или нет)
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN', 'SAFETY_OFFICER')")
    public AccidentResponse getAccidentById(@NotNull @Positive @PathVariable("id") Long id) {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        return this.potentialAccidentService.getAccidentById(tokenData, id);
    }

}
