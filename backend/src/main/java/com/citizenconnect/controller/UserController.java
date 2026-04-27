package com.citizenconnect.controller;

import com.citizenconnect.dto.ApiResponse;
import com.citizenconnect.dto.RegisterRequest;
import com.citizenconnect.dto.UserDTO;
import com.citizenconnect.entity.Role;
import com.citizenconnect.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get users by role")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getUsersByRole(@PathVariable Role role) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(role)));
    }

    @GetMapping("/politicians")
    @Operation(summary = "Get all politicians")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getPoliticians() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(Role.POLITICIAN)));
    }

    @GetMapping("/politicians/constituency/{constituency}")
    @Operation(summary = "Get politicians by constituency")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getPoliticiansByConstituency(@PathVariable String constituency) {
        return ResponseEntity.ok(ApiResponse.success(userService.getPoliticiansByConstituency(constituency)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new user")
    public ResponseEntity<ApiResponse<UserDTO>> createUser(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", userService.createUser(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", userService.updateUser(id, userDTO)));
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user role")
    public ResponseEntity<ApiResponse<UserDTO>> updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity
                .ok(ApiResponse.success("User role updated successfully", userService.updateUserRole(id, role)));
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle user enabled status")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long id) {
        userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status toggled", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user statistics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUserStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalCitizens", userService.countUsersByRole(Role.CITIZEN));
        stats.put("totalPoliticians", userService.countUsersByRole(Role.POLITICIAN));
        stats.put("totalModerators", userService.countUsersByRole(Role.MODERATOR));
        stats.put("totalAdmins", userService.countUsersByRole(Role.ADMIN));
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
