package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.dto.request.DocumentCreationRequest;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentType;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.DocumentedResponse;
import ru.smirnov.accidentrecorder.entity.domain.Document;
import ru.smirnov.accidentrecorder.entity.domain.Response;
import ru.smirnov.accidentrecorder.mapper.abstraction.DocumentMapper;
import ru.smirnov.accidentrecorder.precondition.abstraction.ResponsePreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.DocumentRepository;
import ru.smirnov.accidentrecorder.repository.domain.ResponseRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.DocumentService;
import ru.smirnov.accidentrecorder.service.abstraction.minio.AccidentStorageClient;

@Service
public class DocumentServiceImplementation implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ResponseRepository responseRepository;
    private final ResponsePreconditionService responsePreconditionService;
    private final AccidentStorageClient accidentStorageClient;
    private final DocumentMapper documentMapper;

    @Autowired
    public DocumentServiceImplementation(
            DocumentRepository documentRepository,
            ResponseRepository responseRepository,
            ResponsePreconditionService responsePreconditionService,
            AccidentStorageClient accidentStorageClient,
            DocumentMapper documentMapper
    ) {
        this.documentRepository = documentRepository;
        this.responseRepository = responseRepository;
        this.responsePreconditionService = responsePreconditionService;
        this.accidentStorageClient = accidentStorageClient;
        this.documentMapper = documentMapper;
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Long addDocumentPerResponse(DocumentCreationRequest dto) {

        Response response = this.responsePreconditionService.safelyGetById(dto.getResponseId());
        response.setDocumentedResponse(DocumentedResponse.DOCUMENTED);
        this.responseRepository.save(response);

        String reference = "";

        Document document = this.documentMapper.generateDocumentEntity(
                reference,
                response,
                DocumentType.ACT
        );

        return null;
    }
}
