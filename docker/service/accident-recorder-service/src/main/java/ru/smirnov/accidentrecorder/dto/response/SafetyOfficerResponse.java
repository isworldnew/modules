package ru.smirnov.accidentrecorder.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor
public class SafetyOfficerResponse {

    private Long id;

    private String email;

    private String lastname;

    private String firstname;

    private String parentname;
}
