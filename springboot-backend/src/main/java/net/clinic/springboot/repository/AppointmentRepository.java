package net.clinic.springboot.repository;

import net.clinic.springboot.model.Appointment;
import net.clinic.springboot.model.Doctor;
import net.clinic.springboot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByDoctorAndAppointmentTime(Doctor doctor, LocalDateTime appointmentTime);

    @Query("SELECT a FROM Appointment a WHERE a.user = :user ORDER BY a.appointmentTime ASC")
    List<Appointment> findByUserOrderByAppointmentTimeAsc(@Param("user") User user);

    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentTime BETWEEN :start AND :end")
    List<Appointment> findByDoctorAndAppointmentTimeBetween(
            @Param("doctor") Doctor doctor,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
