package ru.smirnov.accidentrecorder.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor
public class AreaCreationRequest {

    @NotBlank
    private String name;

    @Nullable
    private Long foremanId;

    @Nullable
    private List<Long> safetyOfficersId;

}
