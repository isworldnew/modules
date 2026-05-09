package ru.smirnov.accidentrecorder.service.abstraction.audience;

import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;

public interface UserService {

    UserResponse getUserData(DataForToken tokenData);

}
