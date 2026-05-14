package ru.smirnov.accidentrecorder.service.abstraction.audience;

import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.UserCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;

import java.util.List;


public interface UserService {

    UserResponse getUserData(DataForToken tokenData);

    Long createUser(UserCreationRequest dto);

    List<UserResponse> usersSearch(String searchRequest, String role);
}
