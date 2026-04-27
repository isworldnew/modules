package ru.smirnov.accidentrecorder.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.validation.annotation.AccidentInterpretationLabel;
import ru.smirnov.accidentrecorder.validation.annotation.AccidentTypeLabel;

@Data @NoArgsConstructor
public class ReportRequest {

    @NotNull @Positive
    private Long accidentId;

    private String description;

    @NotBlank @AccidentTypeLabel
    private String type;

    @NotBlank @AccidentInterpretationLabel
    private String interpretation;
}
