package ru.smirnov.accidentrecorder.precondition.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.entity.domain.PotentialAccident;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.PotentialAccidentPreconditionService;
import ru.smirnov.accidentrecorder.repository.domain.PotentialAccidentRepository;

@Service
public class PotentialAccidentPreconditionServiceImplementation implements PotentialAccidentPreconditionService {

    private final PotentialAccidentRepository potentialAccidentRepository;

    @Autowired
    public PotentialAccidentPreconditionServiceImplementation(PotentialAccidentRepository potentialAccidentRepository) {
        this.potentialAccidentRepository = potentialAccidentRepository;
    }

    @Override
    public PotentialAccident safelyGetPotentialAccidentById(Long id) {
        return this.potentialAccidentRepository.findById(id).orElseThrow(
                () -> new NotFoundException("Potential Accident Record with id=" + id + " doesn't exist")
        );
    }

}
