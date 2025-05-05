package net.clinic.springboot.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Size(min = 2)
    private String firstName;

    @NotBlank @Size(min = 2)
    private String lastName;

    @NotBlank @Email
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$")
    private String phone;

    @NotBlank @Size(min = 4)
    private String username;

    @NotBlank @Size(min = 6)
    private String password;
}