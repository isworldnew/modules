package ru.smirnov.accidentrecorder.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

public interface AccidentShortcutResponse {

    Long id();

    String areaName();

    String status();

    OffsetDateTime uploadDateTime();
}
