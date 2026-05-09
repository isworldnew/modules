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
import ru.smirnov.accidentrecorder.dto.request.AreaCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.AreaResponse;
import ru.smirnov.accidentrecorder.dto.response.AreaShortcutResponse;
import ru.smirnov.accidentrecorder.service.abstraction.domain.AreaService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@Validated
public class AreaController {

    private final SecurityContextService securityContextService;
    private final AreaService areaService;

    @Autowired
    public AreaController(SecurityContextService securityContextService, AreaService areaService) {
        this.securityContextService = securityContextService;
        this.areaService = areaService;
    }

    @PostMapping("/area")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public Long createArea( @Valid @RequestBody AreaCreationRequest dto) {
        return this.areaService.createArea(dto);
    }

    @GetMapping("/shortcuts")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public List<AreaShortcutResponse> getAreaShortcuts() {
        return this.areaService.getAreaShortcuts();
    }

    @GetMapping("/area/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public AreaResponse getAreaById(@NotNull @Positive @PathVariable("id") Long id) {
        return this.areaService.getAreaById(id);
    }

}
