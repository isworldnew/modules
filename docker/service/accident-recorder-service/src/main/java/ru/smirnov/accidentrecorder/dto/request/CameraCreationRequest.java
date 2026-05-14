package ru.smirnov.accidentrecorder.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class CameraCreationRequest {

    @NotNull @Positive
    private Long areaId;

    private String name;
}
