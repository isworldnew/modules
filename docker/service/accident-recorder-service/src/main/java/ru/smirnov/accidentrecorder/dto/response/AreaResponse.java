package ru.smirnov.accidentrecorder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor
public class AreaResponse {

    private Long areaId;

    private String name;

    private UserResponse foreman;

    private List<CameraResponse> cameras;

}
