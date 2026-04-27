package ru.smirnov.accidentrecorder.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data @NoArgsConstructor
public class AccidentShortcutResponse {

    private Long id;

    private String areaName;

    private String status;

    private OffsetDateTime uploadDateTime;
}
