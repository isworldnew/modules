package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.mapper.abstraction.UserMapper;

@Component
public class UserMapperImplementation implements UserMapper {

    @Override
    public UserResponse userEntityToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setUsername(user.getUsername());
        userResponse.setLastname(user.getLastname());
        userResponse.setFirstname(user.getFirstname());
        userResponse.setParentname(user.getParentname());
        userResponse.setRole(user.getRole().name());
        userResponse.setStatus(user.getStatus().name());
        return userResponse;
    }

}
