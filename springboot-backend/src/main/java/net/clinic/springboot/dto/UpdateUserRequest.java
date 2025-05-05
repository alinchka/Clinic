package net.clinic.springboot.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private Boolean isAdmin;
}