package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.dto.response.EpisodeShortcutResponse;
import ru.smirnov.accidentrecorder.dto.response.TrespasserShortcutResponse;
import ru.smirnov.accidentrecorder.service.abstraction.domain.TrespasserService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;

import java.util.List;

@RestController
@RequestMapping("/api/trespassers")
public class TrespassersController {

    private final SecurityContextService securityContextService;
    private final TrespasserService trespasserService;

    @Autowired
    public TrespassersController(SecurityContextService securityContextService, TrespasserService trespasserService) {
        this.securityContextService = securityContextService;
        this.trespasserService = trespasserService;
    }

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('FOREMAN', 'SUPERVISOR', 'SUPERADMIN')")
    public List<TrespasserShortcutResponse> findTrespassersByName(@RequestParam(name = "searchRequest", required = false) String searchRequest) {
        return this.trespasserService.trespassersSearch(searchRequest);
    }

    @GetMapping("/{trespasserId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMIN', 'SUPERADMIN', 'FOREMAN')")
    public TrespasserShortcutResponse getTrespasser(
            @PathVariable("trespasserId") @NotNull @Positive Long trespasserId
    ) {
        return this.trespasserService.getTrespasserShortcutById(trespasserId);
    }

}
