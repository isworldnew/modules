package ru.smirnov.accidentrecorder.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.validation.annotation.ResponseTypeLabel;

@Data @AllArgsConstructor @NoArgsConstructor
public class ResponseCreationRequest {

    @NotBlank @ResponseTypeLabel
    private String responseType;

    private String responseReport;

    @Nullable
    private Long trespasserId;

    @Nullable
    private TrespasserCreationRequest trespasser;
}
