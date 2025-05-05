package net.clinic.springboot.controller;

import lombok.RequiredArgsConstructor;
import net.clinic.springboot.dto.AppointmentRequest;
import net.clinic.springboot.dto.AppointmentResponse;
import net.clinic.springboot.model.Appointment;
import net.clinic.springboot.model.User;
import net.clinic.springboot.security.UserPrincipal;
import net.clinic.springboot.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;
    @PostMapping
    public Appointment createAppointment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AppointmentRequest request) {
        if (userPrincipal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return appointmentService.createAppointment(
                userPrincipal.getUser().getId(), // Передаем ID пользователя
                request.getDoctorId(),
                request.getAppointmentTime()
        );
    }
    @GetMapping("/my")
    public List<AppointmentResponse> getUserAppointments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return appointmentService.getUserAppointments(userPrincipal.getUser()).stream()
                .map(app -> {
                    AppointmentResponse response = new AppointmentResponse();
                    response.setId(app.getId());
                    response.setUserId(app.getUser().getId());
                    response.setDoctorId(app.getDoctor().getId());
                    response.setAppointmentTime(app.getAppointmentTime());
                    // Добавляем данные доктора
                    response.setDoctorName(app.getDoctor().getName());
                    response.setDoctorSpecialty(app.getDoctor().getSpecialty());
                    return response;
                })
                .toList();
    }
    @GetMapping("/available")
    public List<LocalDateTime> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime date
    ) {
        return appointmentService.getAvailableSlots(doctorId, date);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        appointmentService.deleteAppointment(id, userPrincipal.getUser().getId());
        return ResponseEntity.ok().build();
    }
}