package ru.smirnov.accidentrecorder.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.smirnov.accidentrecorder.validation.annotation.RoleLabel;

@Data @AllArgsConstructor @NoArgsConstructor
public class UserCreationRequest {

    @NotBlank @Size(min = 8) @Email
    private String username;

    @NotBlank @Size(min = 8)
    private String password;

    @NotBlank @RoleLabel
    private String role;

    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;

    private String parentname;
}
