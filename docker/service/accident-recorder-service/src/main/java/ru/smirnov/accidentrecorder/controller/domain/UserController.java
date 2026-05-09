package ru.smirnov.accidentrecorder.controller.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.service.abstraction.audience.UserService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;

@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {

    private final SecurityContextService securityContextService;
    private final UserService userService;

    @Autowired
    public UserController(SecurityContextService securityContextService, UserService userService) {
        this.securityContextService = securityContextService;
        this.userService = userService;
    }

    @GetMapping("/user")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse getUserData() {
        DataForToken tokenData = this.securityContextService.safelyExtractTokenDataFromSecurityContext();
        return this.userService.getUserData(tokenData);
    }

}
