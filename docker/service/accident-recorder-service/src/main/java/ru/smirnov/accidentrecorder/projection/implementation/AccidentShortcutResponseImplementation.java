package ru.smirnov.accidentrecorder.projection.implementation;

import lombok.AllArgsConstructor;
import lombok.Data;
import ru.smirnov.accidentrecorder.projection.abstraction.AccidentShortcutResponse;

import java.time.Instant;
import java.time.OffsetDateTime;

@Data @AllArgsConstructor
public class AccidentShortcutResponseImplementation implements AccidentShortcutResponse {

    private Long id;

    private String areaName;

    private String status;

    private String uploadDateTime;
}
