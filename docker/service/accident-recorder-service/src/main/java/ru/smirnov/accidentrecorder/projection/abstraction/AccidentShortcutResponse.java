package ru.smirnov.accidentrecorder.projection.abstraction;

import java.time.Instant;
import java.time.OffsetDateTime;

public interface AccidentShortcutResponse {

    Long getId();

    String getAreaName();

    String getStatus();

    String getUploadDateTime();
}
