package com.smarthr.service;

import com.smarthr.dto.AuthResponse;
import com.smarthr.dto.LoginRequest;
import com.smarthr.dto.RegisterRequest;
import com.smarthr.entity.Role;
import com.smarthr.entity.User;
import com.smarthr.repository.RoleRepository;
import com.smarthr.repository.UserRepository;
import com.smarthr.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    /** Register a new user */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already in use");
        }

        // Determine role
        String roleName = resolveRole(request.getRole());
        Role role = roleRepository.findByName(roleName)
            .orElseThrow(() -> new IllegalStateException("Role not found: " + roleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .roles(roles)
            .build();

        userRepository.save(user);

        // Automatically log them in after registration
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        return buildAuthResponse(token, user, roles);
    }

    /** Login and return JWT */
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow();

        return buildAuthResponse(token, user, user.getRoles());
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private String resolveRole(String raw) {
        if (raw == null || raw.isBlank()) return "ROLE_EMPLOYEE";
        return switch (raw.toUpperCase().replace("ROLE_", "")) {
            case "ADMIN"    -> "ROLE_ADMIN";
            case "HR"       -> "ROLE_HR";
            default         -> "ROLE_EMPLOYEE";
        };
    }

    private AuthResponse buildAuthResponse(String token, User user, Set<Role> roles) {
        return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .username(user.getUsername())
            .email(user.getEmail())
            .roles(roles.stream().map(Role::getName).collect(Collectors.toSet()))
            .build();
    }
}
