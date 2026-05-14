package ru.smirnov.accidentrecorder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class ForemanAccidentResponse {

    private Long id;

    private String type;

    private String report;
}
