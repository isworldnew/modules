package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
import ru.smirnov.accidentrecorder.dto.request.UserCreationRequest;
import ru.smirnov.accidentrecorder.dto.response.UserResponse;
import ru.smirnov.accidentrecorder.service.abstraction.audience.UserService;
import ru.smirnov.accidentrecorder.service.abstraction.security.SecurityContextService;
import ru.smirnov.accidentrecorder.validation.annotation.RoleLabel;

import java.util.List;

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

    @PostMapping("/user")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public Long createUser(@Valid @RequestBody UserCreationRequest dto) {
        return this.userService.createUser(dto);
    }

}
