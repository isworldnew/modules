package ru.smirnov.accidentrecorder.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor
public class ReportResponse {

    private Long id;

    private String description;

    private String accidentInterpretation;

    private String accidentType;
}
