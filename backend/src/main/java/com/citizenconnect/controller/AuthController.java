package com.citizenconnect.controller;

import com.citizenconnect.dto.*;
import com.citizenconnect.entity.Role;
import com.citizenconnect.entity.User;
import com.citizenconnect.exception.BadRequestException;
import com.citizenconnect.repository.UserRepository;
import com.citizenconnect.security.JwtTokenProvider;
import com.citizenconnect.service.EmailService;
import com.citizenconnect.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and registration endpoints")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          UserService userService,
                          UserRepository userRepository,
                          EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register citizen")
    public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest request) {
        if (request.getRole() == null) {
            request.setRole(Role.CITIZEN);
        }

        if (request.getRole() != Role.CITIZEN) {
            throw new BadRequestException("Use the appropriate endpoint for your role (politician, admin, moderator)");
        }

        UserDTO user = userService.createUser(request);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Citizen registration successful", user));
    }

    @PostMapping("/register/politician")
    @Operation(summary = "Register politician")
    public ResponseEntity<ApiResponse<UserDTO>> registerPolitician(@Valid @RequestBody RegisterRequest request) {
        if (request.getRole() == null) {
            request.setRole(Role.POLITICIAN);
        }

        if (request.getRole() != Role.POLITICIAN) {
            throw new BadRequestException("This endpoint is only for politician registration");
        }

        UserDTO user = userService.createUser(request);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Politician registration successful", user));
    }

    @PostMapping("/register/admin")
    @Operation(summary = "Register admin user (Admin only)")
    public ResponseEntity<ApiResponse<UserDTO>> registerAdmin(@Valid @RequestBody RegisterRequest request) {
        if (request.getRole() == null) {
            request.setRole(Role.ADMIN);
        }

        if (request.getRole() != Role.ADMIN) {
            throw new BadRequestException("This endpoint is only for admin registration");
        }

        UserDTO user = userService.createUser(request);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Admin registration successful", user));
    }

    @PostMapping("/register/moderator")
    @Operation(summary = "Register moderator user (Admin only)")
    public ResponseEntity<ApiResponse<UserDTO>> registerModerator(@Valid @RequestBody RegisterRequest request) {
        if (request.getRole() == null) {
            request.setRole(Role.MODERATOR);
        }

        if (request.getRole() != Role.MODERATOR) {
            throw new BadRequestException("This endpoint is only for moderator registration");
        }

        UserDTO user = userService.createUser(request);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Moderator registration successful", user));
    }

    @PostMapping("/login")
    @Operation(summary = "Login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .constituency(user.getConstituency())
                .profileImage(user.getProfileImage())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();

        LoginResponse loginResponse = new LoginResponse(token, userDTO);

        return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(Authentication authentication) {

        String email = authentication.getName();
        UserDTO user = userService.getUserByEmail(email);

        return ResponseEntity.ok(ApiResponse.success(user));
    }
}