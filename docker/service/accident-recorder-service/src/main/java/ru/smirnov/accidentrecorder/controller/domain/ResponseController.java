package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.dto.request.ResponseCreationRequest;
import ru.smirnov.accidentrecorder.service.abstraction.domain.ResponseService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;

@RestController
@RequestMapping("/api/responses")
@Validated
public class ResponseController {

    private final SecurityContextService securityContextService;
    private final ResponseService responseService;

    @Autowired
    public ResponseController(SecurityContextService securityContextService, ResponseService responseService) {
        this.securityContextService = securityContextService;
        this.responseService = responseService;
    }

    @PostMapping("/accident/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('FOREMAN')")
    public void saveAccidentResponse(
            @NotNull @Positive @PathVariable("id") Long accidentReportId,
            @Valid @RequestBody ResponseCreationRequest dto
    ) {
        this.responseService.createResponse(accidentReportId, dto);
    }
}
