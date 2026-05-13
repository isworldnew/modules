package ru.smirnov.accidentrecorder.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.validation.annotation.ResponseTypeLabel;

@Data @AllArgsConstructor @NoArgsConstructor
public class ResponseCreationRequest {

    @NotNull @Positive
    private Long accidentReportId;

    @NotBlank @ResponseTypeLabel
    private String responseStatus;

    private String responseReport;

    @Nullable
    private Long trespasserId;

    @Nullable
    private TrespasserCreationRequest trespasser;
}
