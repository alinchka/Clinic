package net.clinic.springboot.service;

import lombok.RequiredArgsConstructor;
import net.clinic.springboot.dto.RegisterRequest;
import net.clinic.springboot.dto.UpdateUserRequest;
import net.clinic.springboot.model.Role;
import net.clinic.springboot.model.User;
import net.clinic.springboot.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());

        if (request.getIsAdmin() != null) {
            Set<Role> newRoles = new HashSet<>();
            if (request.getIsAdmin()) {
                newRoles.add(Role.ADMIN);
            } else {
                newRoles.add(Role.USER);
            }
            user.setRoles(newRoles);
        }

        return userRepository.save(user);
    }
    public User registerUser(RegisterRequest request, boolean isAdmin) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email уже используется");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Имя пользователя уже занято");
        }

        // Исправлено: создаем новый Set для ролей
        Set<Role> roles = new HashSet<>();
        if (isAdmin) {
            roles.add(Role.ADMIN);
        } else {
            roles.add(Role.USER);
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles) // Используем наш новый Set
                .build();

        return userRepository.save(user);
    }

    public boolean isAdmin(User user) {
        return user.getRoles().contains(Role.ADMIN);
    }
}