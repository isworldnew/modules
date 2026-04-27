package ru.smirnov.accidentrecorder.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class LoginRequest {

    // TODO: добавить валидатор под regex почты
    private String email;

    @NotBlank
    @Size(min = 10, message = "Password's size should be >= 10")
    private String password;
}
