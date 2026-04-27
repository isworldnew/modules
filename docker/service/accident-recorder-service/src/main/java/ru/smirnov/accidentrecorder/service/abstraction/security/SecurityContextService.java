package ru.smirnov.accidentrecorder.service.abstraction.security;

import ru.smirnov.accidentrecorder.authentication.DataForToken;

public interface SecurityContextService {

    DataForToken safelyExtractTokenDataFromSecurityContext();
}
