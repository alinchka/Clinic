package net.clinic.springboot.controller;

import net.clinic.springboot.dto.RegisterRequest;
import net.clinic.springboot.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Random;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerFuzzTest {
    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void cleanup() {
        userRepository.deleteAll();
    }
    @Autowired
    private MockMvc mockMvc;

    private final Random random = new Random();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void fuzzTestRegistration() throws Exception {
        for (int i = 0; i < 50; i++) {
            RegisterRequest request = generateRandomRequest();
            String json = objectMapper.writeValueAsString(request);

            MvcResult result = mockMvc.perform(post("/api/auth/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(json))
                    .andReturn();

        }
    }

    private RegisterRequest generateRandomRequest() {
        RegisterRequest request = new RegisterRequest();
        boolean isValid = random.nextBoolean();

        request.setFirstName(isValid ? generateRandomString(2, 50) : generateRandomString(0, 100));
        request.setLastName(isValid ? generateRandomString(2, 50) : generateRandomString(0, 50));
        request.setEmail(generateUniqueEmail());  // Гарантированно уникальный email
        request.setPhone(generateUniquePhone());  // Гарантированно уникальный телефон
        request.setUsername(generateUniqueUsername());
        request.setPassword(isValid ? generateRandomString(6, 100) : generateRandomString(0, 5));

        return request;
    }

    private String generateUniqueEmail() {
        return "test-" + UUID.randomUUID() + "@example.com";
    }
    private String generateUniqueUsername() {
        // Generate a base random username
        String base = generateRandomString(4, 20);

        // Add UUID to ensure uniqueness
        String uniquePart = UUID.randomUUID().toString().replace("-", "").substring(0, 8);

        // Combine and ensure length limits
        String username = base + "_" + uniquePart;
        return username.length() > 20 ? username.substring(0, 20) : username;
    }
    private String generateUniquePhone() {
        // Generate random 9 digits (Russian phone number format)
        long number = 1_000_000_000L + (random.nextLong() % 9_000_000_000L);
        return "+79" + Math.abs(number);
    }

    private String generateRandomString(int minLen, int maxLen) {
        int length = random.nextInt(maxLen - minLen + 1) + minLen;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append((char) (random.nextInt(26) + 'a'));
        }
        return sb.toString();
    }
}