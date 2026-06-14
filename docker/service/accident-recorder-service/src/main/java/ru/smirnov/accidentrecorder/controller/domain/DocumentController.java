package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.smirnov.accidentrecorder.dto.request.DocumentCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.DocumentResponse;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentType;
import ru.smirnov.accidentrecorder.service.abstraction.domain.DocumentService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;

import java.time.OffsetDateTime;
import java.util.List;

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
    public Long addDocumentPerResponse(
            @NotNull @Positive @RequestParam(value = "responseId", required = true) Long responseId,
            @NotNull @RequestParam(value = "document", required = true) MultipartFile document
    ) {
        return this.documentService.addDocumentPerResponse(
                new DocumentCreationRequest(
                        responseId,
                        document,
                        DocumentType.ACT.name())
        );
    }

    @GetMapping("/by-accident/{accidentId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'FOREMAN')")
    public DocumentResponse getDocumentByAccidentId(
            @NotNull @Positive @PathVariable("accidentId") Long accidentId
    ) {
        return this.documentService.getDocumentByAccidentId(accidentId);
    }

    @GetMapping("/date-range")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('SAFETY_OFFICER', 'FOREMAN', 'SUPERVISOR', 'ADMIN', 'SUPERADMIN')")
    public List<DocumentResponse> getDocumentsByDateTimeRange(
            @RequestParam(name = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime dateFrom,
            @RequestParam(name = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime dateTo
    ) {
        return this.documentService.getDocumentsByDateTimeRange(dateFrom, dateTo);
    }
}