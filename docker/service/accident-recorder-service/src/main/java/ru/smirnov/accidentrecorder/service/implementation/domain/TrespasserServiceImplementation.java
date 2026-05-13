package ru.smirnov.accidentrecorder.service.implementation.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import ru.smirnov.accidentrecorder.dto.request.TrespasserCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.TrespasserShortcutResponse;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;
import ru.smirnov.accidentrecorder.mapper.abstraction.TrespasserMapper;
import ru.smirnov.accidentrecorder.precondition.abstraction.TrespasserPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.TrespasserRepository;
import ru.smirnov.accidentrecorder.service.abstraction.domain.TrespasserService;

import java.util.List;

@Service
public class TrespasserServiceImplementation implements TrespasserService {

    private final TrespasserRepository trespasserRepository;
    private final TrespasserPreconditionService trespasserPreconditionService;
    private final TrespasserMapper trespasserMapper;

    @Autowired
    public TrespasserServiceImplementation(
            TrespasserRepository trespasserRepository,
            TrespasserPreconditionService trespasserPreconditionService,
            TrespasserMapper trespasserMapper
    ) {
        this.trespasserRepository = trespasserRepository;
        this.trespasserPreconditionService = trespasserPreconditionService;
        this.trespasserMapper = trespasserMapper;
    }

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Trespasser createTrespasser(TrespasserCreationRequest dto) {
        Trespasser trespasser = this.trespasserMapper.trespasserCreationRequestToTrespasserEntity(dto);
        this.trespasserRepository.save(trespasser);
        return trespasser;
    }


    @Override
    public List<TrespasserShortcutResponse> trespassersSearch(String searchRequest) {
         return this.trespasserRepository.searchByNameNative(searchRequest).stream()
                 .map(this.trespasserMapper::trespasserEntityToTrespasserShortcutResponse)
                 .toList();
    }

}
