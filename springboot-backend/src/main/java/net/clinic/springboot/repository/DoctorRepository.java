package net.clinic.springboot.repository;

import net.clinic.springboot.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialty(String specialty);  // Поиск врачей по специальности
}
