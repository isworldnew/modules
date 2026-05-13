package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.dto.request.ResponseCreationRequest;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;
import ru.smirnov.accidentrecorder.precondition.abstraction.TrespasserPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.ResponseRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.ResponseService;
import ru.smirnov.accidentrecorder.service.abstraction.domain.TrespasserService;

@Service
public class ResponseServiceImplementation implements ResponseService {

    private final ResponseRepository responseRepository;
    private final TrespasserService trespasserService;
    private final TrespasserPreconditionService trespasserPreconditionService;

    @Autowired
    public ResponseServiceImplementation(
            ResponseRepository responseRepository,
            TrespasserService trespasserService,
            TrespasserPreconditionService trespasserPreconditionService
    ) {
        this.responseRepository = responseRepository;
        this.trespasserService = trespasserService;
        this.trespasserPreconditionService = trespasserPreconditionService;
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Long createResponse(ResponseCreationRequest dto) {

        Trespasser trespasser = null;

        if (dto.getTrespasserId() == null && dto.getTrespasser() == null) {

        }

        if (dto.getTrespasserId() != null && dto.getTrespasser() == null) {

        }

        if (dto.getTrespasserId() == null && dto.getTrespasser() != null) {

        }



    }

}
