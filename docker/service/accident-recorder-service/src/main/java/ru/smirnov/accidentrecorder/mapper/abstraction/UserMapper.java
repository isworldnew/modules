package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.entity.audience.User;

public interface UserMapper {

    UserResponse userEntityToUserResponse(User user);

}
