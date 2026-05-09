package ru.smirnov.accidentrecorder.precondition.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.exception.NotFoundException;
import ru.smirnov.accidentrecorder.precondition.abstraction.UserPreconditionService;
import ru.smirnov.accidentrecorder.repository.audience.UserRepository;

@Service
public class UserPreconditionServiceImplementation implements UserPreconditionService {

    private final UserRepository userRepository;

    @Autowired
    public UserPreconditionServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User safelyGetById(Long id) {
        return this.userRepository.findById(id).orElseThrow(
                () -> new NotFoundException("No user with id=" + id)
        );
    }
}
