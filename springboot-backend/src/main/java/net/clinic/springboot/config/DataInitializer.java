package net.clinic.springboot.config;

import lombok.RequiredArgsConstructor;
import net.clinic.springboot.model.Role;
import net.clinic.springboot.model.User;
import net.clinic.springboot.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Проверяем, есть ли уже админ в системе
        if (!userRepository.existsByEmail("admin@clinic.com")) {
            System.out.println("Creating admin user...");
            // Создаем администратора
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("Admin")
                    .email("admin@clinic.com")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+79000000000")
                    .roles(Set.of(Role.ADMIN, Role.USER))
                    .build();

            userRepository.save(admin);
            System.out.println("Admin user created successfully!");
            System.out.println("Email: admin@clinic.com");
            System.out.println("Password: admin123");
        } else {
            System.out.println("Admin user already exists");
        }
    }
} 