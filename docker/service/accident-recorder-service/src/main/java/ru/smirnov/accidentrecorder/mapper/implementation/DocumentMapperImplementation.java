package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentType;
import ru.smirnov.accidentrecorder.entity.domain.Document;
import ru.smirnov.accidentrecorder.entity.domain.Response;
import ru.smirnov.accidentrecorder.mapper.abstraction.DocumentMapper;


@Component
public class DocumentMapperImplementation implements DocumentMapper {

    @Override
    public Document generateDocumentEntity(String fullReference, Response response, DocumentType documentType) {
        Document document = new Document();
        document.setDocumentReference(fullReference);
        document.setResponse(response);
        document.setDocumentType(documentType);
        return document;
    }

}
