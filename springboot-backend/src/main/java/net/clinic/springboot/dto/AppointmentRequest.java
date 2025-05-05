package net.clinic.springboot.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull(message = "ID врача обязательно")
    private Long doctorId;

    @NotNull(message = "Время записи обязательно")
    @Future(message = "Дата должна быть в будущем")
    private LocalDateTime appointmentTime;
}