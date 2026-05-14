package ru.smirnov.accidentrecorder.mapper.implementation;

import org.springframework.stereotype.Component;
import ru.smirnov.accidentrecorder.dto.request.UserCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.entity.audience.User;
import ru.smirnov.accidentrecorder.entity.auxiliary.fixed.Role;
import ru.smirnov.accidentrecorder.mapper.abstraction.UserMapper;

@Component
public class UserMapperImplementation implements UserMapper {

    @Override
    public UserResponse userEntityToUserResponse(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setLastname(user.getLastname());
        userResponse.setFirstname(user.getFirstname());
        userResponse.setParentname(user.getParentname());
        userResponse.setRole(user.getRole().name());
        userResponse.setStatus(user.getStatus().name());
        return userResponse;
    }

    @Override
    public User userCreationRequestToUserEntity(UserCreationRequest dto, String encryptedPassword) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(encryptedPassword);
        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
        user.setLastname(dto.getLastname());
        user.setFirstname(dto.getFirstname());
        user.setParentname(dto.getParentname());
        return user;
    }
}
