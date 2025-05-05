package net.clinic.springboot.service;

import lombok.RequiredArgsConstructor;
import net.clinic.springboot.dto.AuthRequest;
import net.clinic.springboot.dto.RegisterRequest;
import net.clinic.springboot.model.*;
import net.clinic.springboot.repository.UserRepository;
import net.clinic.springboot.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public String authenticate(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        return jwtTokenProvider.generateToken(authentication);
    }

    public User register(RegisterRequest request, boolean isAdmin) {
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(isAdmin ? Set.of(Role.USER, Role.ADMIN) : Set.of(Role.USER))
                .build();

        return userRepository.save(user);
    }
}