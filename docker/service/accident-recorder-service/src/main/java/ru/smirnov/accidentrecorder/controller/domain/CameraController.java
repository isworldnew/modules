package ru.smirnov.accidentrecorder.controller.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.dto.request.CameraCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.CameraShortcutResponse;
import ru.smirnov.accidentrecorder.service.abstraction.domain.CameraService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;

import java.util.List;

@RestController
@RequestMapping("/api/cameras")
@Validated
public class CameraController {

    private final SecurityContextService securityContextService;
    private final CameraService cameraService;

    @Autowired
    public CameraController(SecurityContextService securityContextService, CameraService cameraService) {
        this.securityContextService = securityContextService;
        this.cameraService = cameraService;
    }

    @PostMapping("/camera")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
    public Long createCamera(CameraCreationRequest dto) {
        return this.cameraService.createCamera(dto);
    }

    @GetMapping("/shortcuts")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN', 'SUPERVISOR')")
    public List<CameraShortcutResponse> getCameraShortcuts() {
        return this.cameraService.getCameraShortcuts();
    }

}
