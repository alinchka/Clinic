package net.clinic.springboot.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentResponse {
    private Long id;
    private Long userId;
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private String doctorName;
    private String doctorSpecialty;
}