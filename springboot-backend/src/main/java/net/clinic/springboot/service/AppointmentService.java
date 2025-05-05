package net.clinic.springboot.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import net.clinic.springboot.model.Appointment;
import net.clinic.springboot.model.Doctor;
import net.clinic.springboot.model.User;
import net.clinic.springboot.repository.AppointmentRepository;
import net.clinic.springboot.repository.DoctorRepository;
import net.clinic.springboot.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    public Appointment createAppointment(Long userId, Long doctorId, LocalDateTime appointmentTime) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Врач не найден"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User не найден"));
        if (appointmentTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Нельзя записаться на прошедшее время");
        }
        if (appointmentRepository.existsByDoctorAndAppointmentTime(doctor, appointmentTime)) {
            throw new IllegalStateException("Это время уже занято");
        }
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(appointmentTime);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getUserAppointments(User user) {
        return appointmentRepository.findByUserOrderByAppointmentTimeAsc(user);
    }
    public List<LocalDateTime> getAvailableSlots(Long doctorId, LocalDateTime date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Врач не найден"));
        LocalDateTime start = date.with(LocalTime.of(9, 0)); // Начало рабочего дня
        LocalDateTime end = date.with(LocalTime.of(18, 0)); // Конец рабочего дня
        // Получаем занятые слоты
        List<Appointment> bookedAppointments = appointmentRepository
                .findByDoctorAndAppointmentTimeBetween(doctor, start, end);
        // Генерируем все возможные слоты (каждые 30 минут)
        List<LocalDateTime> allSlots = new ArrayList<>();
        for (LocalDateTime time = start; time.isBefore(end); time = time.plusMinutes(30)) {
            allSlots.add(time);
        }
        // Фильтруем занятые слоты
        List<LocalDateTime> bookedTimes = bookedAppointments.stream()
                .map(Appointment::getAppointmentTime)
                .toList();
        return allSlots.stream()
                .filter(slot -> !bookedTimes.contains(slot))
                .filter(slot -> slot.isAfter(LocalDateTime.now())) // Только будущие слоты
                .toList();
    }
    public void deleteAppointment(Long appointmentId, Long userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Запись не найдена"));
        appointmentRepository.delete(appointment);
    }
}