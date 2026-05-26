package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentType;
import ru.smirnov.accidentrecorder.entity.domain.Document;
import ru.smirnov.accidentrecorder.entity.domain.Response;

public interface DocumentMapper {

    Document generateDocumentEntity(String fullReference, Response response, DocumentType documentType);
}
