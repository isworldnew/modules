package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.response.AccidentShortcutResponse;
import ru.smirnov.accidentrecorder.service.abstraction.domain.PotentialAccidentService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;
import ru.smirnov.accidentrecorder.validation.annotation.AccidentStatusLabel;

import java.util.List;

@RestController
@RequestMapping("/accidents")
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

    // шорткаты UNPROCESSED или PROCESSED
    @GetMapping("/shortcuts")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN', 'SAFETY_OFFICER')")
    public List<AccidentShortcutResponse> getAccidentShortcutsByStatus(
            @NotBlank @AccidentStatusLabel @RequestParam(name = "status") String status
    ) {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        return this.potentialAccidentService.getAccidentShortcutsByStatus(tokenData, status);
    }

}
