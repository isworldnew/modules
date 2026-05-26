package ru.smirnov.accidentrecorder.service.abstraction.domain;

import ru.smirnov.accidentrecorder.dto.request.DocumentCreationRequest;

public interface DocumentService {
    Long addDocumentPerResponse(DocumentCreationRequest dto);
}
