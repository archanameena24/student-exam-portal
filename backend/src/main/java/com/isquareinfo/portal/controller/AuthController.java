package com.isquareinfo.portal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.isquareinfo.portal.repository.UserRepository;
import com.isquareinfo.portal.model.User;
import com.isquareinfo.portal.config.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Set;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String,String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String name = body.getOrDefault("fullName", username);
        String role = body.getOrDefault("role", "ROLE_STUDENT");

        if (userRepository.findByUsername(username).isPresent()) {
            return Map.of("error", "username_exists");
        }

        User u = new User();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password));
        u.setFullName(name);
        u.setRoles(Set.of(role));
        userRepository.save(u);
        String token = tokenProvider.generateToken(username);
        return Map.of("token", token, "username", username);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String,String> body) {
        String username = body.get("username");
        String password = body.get("password");
        User u = userRepository.findByUsername(username).orElseThrow();
        if (!passwordEncoder.matches(password, u.getPassword())) {
            return Map.of("error", "invalid_credentials");
        }
        String token = tokenProvider.generateToken(username);
        return Map.of("token", token, "username", username);
    }
}
