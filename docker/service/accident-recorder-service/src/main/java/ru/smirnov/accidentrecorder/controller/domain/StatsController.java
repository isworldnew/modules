package ru.smirnov.accidentrecorder.controller.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;
import ru.smirnov.accidentrecorder.service.abstraction.util.StatsService;

@RestController
@RequestMapping("/api/stats")
@Validated
public class StatsController {

    private final SecurityContextService securityContextService;
    private final StatsService statsService;

    @Autowired
    public StatsController(SecurityContextService securityContextService, StatsService statsService) {
        this.securityContextService = securityContextService;
        this.statsService = statsService;
    }

    // для всех методов: @PreAuthorize("hasRole('SUPERVISOR')")
}
