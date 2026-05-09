package ru.smirnov.accidentrecorder.precondition.abstraction;

import ru.smirnov.accidentrecorder.entity.audience.User;

public interface UserPreconditionService {
    User safelyGetById(Long id);
}
