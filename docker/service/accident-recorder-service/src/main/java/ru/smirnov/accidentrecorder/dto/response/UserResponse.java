package ru.smirnov.accidentrecorder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class UserResponse {

    private String username;

    private String firstname;

    private String lastname;

    private String parentname;

    private String role;

    private String status;

}
