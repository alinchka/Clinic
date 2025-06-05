package net.clinic.springboot.controller;
import org.springframework.security.core.GrantedAuthority;
import lombok.RequiredArgsConstructor;
import net.clinic.springboot.dto.AuthRequest;
import net.clinic.springboot.dto.RegisterRequest;
import net.clinic.springboot.model.User;
import net.clinic.springboot.security.JwtTokenProvider;
import net.clinic.springboot.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            String jwt = tokenProvider.generateToken(authentication);

            // Получаем список ролей как строки
            List<String> roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "username", authentication.getName(),
                    "roles", roles // Отправляем роли на фронтенд
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Invalid credentials",
                "message", "Неверный email или пароль"
            ));
        }
    }
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request, false);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> registerAdmin(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request, true);
        return ResponseEntity.ok(user);
    }
}