package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.dto.request.DocumentCreationRequest;
import ru.smirnov.accidentrecorder.service.abstraction.domain.DocumentService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;

@RestController
@RequestMapping("/api/documents")
@Validated
public class DocumentController {

    private final SecurityContextService securityContextService;
    private final DocumentService documentService;

    @Autowired
    public DocumentController(SecurityContextService securityContextService, DocumentService documentService) {
        this.securityContextService = securityContextService;
        this.documentService = documentService;
    }

    @PostMapping("/document")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('SUPERVISOR')")
    public Long addDocumentPerResponse(@Valid @RequestBody DocumentCreationRequest dto) {
        return null;
    }

}
