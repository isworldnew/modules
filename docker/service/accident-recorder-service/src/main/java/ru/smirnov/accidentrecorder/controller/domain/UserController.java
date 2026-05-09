package ru.smirnov.accidentrecorder.controller.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.smirnov.accidentrecorder.authentication.DataForToken;
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

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN', 'SUPERVISOR')")
    public List<UserResponse> getUsers(
            @RoleLabel @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "request", required = false) String request
    ) {
        return this.userService.generalizedUserSearch(role, request);
    }

}
