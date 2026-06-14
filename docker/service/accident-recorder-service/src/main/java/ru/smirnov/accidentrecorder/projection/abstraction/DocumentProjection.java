package ru.smirnov.accidentrecorder.projection.abstraction;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public interface DocumentProjection {
    Long getDocumentId();
    String getDocumentReference();
    String getDocumentType();
    String getAccidentDateTime();
}
