package ru.smirnov.accidentrecorder.mapper.abstraction;

import ru.smirnov.accidentrecorder.dto.request.UserCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.entity.audience.User;

public interface UserMapper {

    UserResponse userEntityToUserResponse(User user);

    User userCreationRequestToUserEntity(UserCreationRequest dto, String encryptedPassword);
}
