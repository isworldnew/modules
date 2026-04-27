package ru.smirnov.accidentrecorder.dto.response;

import lombok.Data;

@Data
public class JwtResponse {

    private String accessToken;

    private String refreshToken;
}
