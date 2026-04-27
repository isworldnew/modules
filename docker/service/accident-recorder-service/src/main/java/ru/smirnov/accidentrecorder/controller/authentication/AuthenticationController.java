package ru.smirnov.accidentrecorder.controller.authentication;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.smirnov.accidentrecorder.authentication.TokenGenerator;
import ru.smirnov.accidentrecorder.dto.request.LoginRequest;
import ru.smirnov.accidentrecorder.dto.response.JwtResponse;

@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    private final TokenGenerator tokenGenerator;

    @Autowired
    public AuthenticationController(TokenGenerator tokenGenerator) {
        this.tokenGenerator = tokenGenerator;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> createTokens(@RequestBody @Valid LoginRequest dto) {
        return this.tokenGenerator.createTokens(dto);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshTokens() {
        return this.tokenGenerator.refreshTokens();
    }

}
