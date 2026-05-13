package ru.smirnov.accidentrecorder.precondition.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.entity.domain.Trespasser;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.TrespasserPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.TrespasserRepository;

@Component
public class TrespasserPreconditionServiceImplementation implements TrespasserPreconditionService {

    private TrespasserRepository trespasserRepository;

    @Autowired
    public TrespasserPreconditionServiceImplementation(TrespasserRepository trespasserRepository) {
        this.trespasserRepository = trespasserRepository;
    }

    @Override
    public Trespasser safelyGetById(Long id) {
        return this.trespasserRepository.findById(id).orElseThrow(
                () -> new NotFoundException("No trespasser found with id=" + id)
        );
    }
}
