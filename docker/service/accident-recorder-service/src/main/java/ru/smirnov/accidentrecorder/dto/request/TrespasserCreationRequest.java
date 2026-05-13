package ru.smirnov.accidentrecorder.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class TrespasserCreationRequest {

    @NotBlank
    private String name;

    private String post;

    @NotBlank @TrespasserRelationLabel
    private String relation;

    @NotBlank @Email
    private String email;
}
