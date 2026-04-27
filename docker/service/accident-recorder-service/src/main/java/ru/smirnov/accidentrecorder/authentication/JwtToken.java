package ru.smirnov.accidentrecorder.authentication;

import lombok.Getter;

@Getter
public enum JwtToken {

    ACCESS_TOKEN(1 * 60 * 60 * 1000), // 1 час
    REFRESH_TOKEN(8 * 60 * 60 * 1000); // 8 часов

    private final long validityDuration;

    JwtToken(long validityDuration) {
        this.validityDuration = validityDuration;
    }

}
