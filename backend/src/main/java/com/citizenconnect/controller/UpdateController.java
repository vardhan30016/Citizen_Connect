package com.citizenconnect.controller;

import com.citizenconnect.dto.ApiResponse;
import com.citizenconnect.dto.CreateUpdateRequest;
import com.citizenconnect.dto.UpdateDTO;
import com.citizenconnect.security.AuthenticationFacade;
import com.citizenconnect.service.UpdateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/updates")
@Tag(name = "Updates", description = "Politician updates/announcements")
public class UpdateController {

    private final UpdateService updateService;
    private final AuthenticationFacade authFacade;

    public UpdateController(UpdateService updateService, AuthenticationFacade authFacade) {
        this.updateService = updateService;
        this.authFacade = authFacade;
    }

    @PostMapping
    @PreAuthorize("hasRole('POLITICIAN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Create update")
    public ResponseEntity<ApiResponse<UpdateDTO>> createUpdate(@Valid @RequestBody CreateUpdateRequest request) {
        Long politicianId = authFacade.getCurrentUserId();
        UpdateDTO update = updateService.createUpdate(request, politicianId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Update posted successfully", update));
    }

    @GetMapping
    @Operation(summary = "Get all published updates")
    public ResponseEntity<ApiResponse<List<UpdateDTO>>> getAllPublishedUpdates() {
        return ResponseEntity.ok(ApiResponse.success(updateService.getAllPublishedUpdates()));
    }

    @GetMapping("/paged")
    @Operation(summary = "Get updates with pagination")
    public ResponseEntity<ApiResponse<Page<UpdateDTO>>> getUpdatesWithPaging(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(updateService.getPublishedUpdatesWithPaging(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get update by ID")
    public ResponseEntity<ApiResponse<UpdateDTO>> getUpdateById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(updateService.getUpdateById(id)));
    }

    @GetMapping("/politician/{politicianId}")
    @Operation(summary = "Get updates by politician")
    public ResponseEntity<ApiResponse<List<UpdateDTO>>> getUpdatesByPolitician(@PathVariable Long politicianId) {
        return ResponseEntity.ok(ApiResponse.success(updateService.getPublishedUpdatesByPolitician(politicianId)));
    }

    @GetMapping("/my-updates")
    @PreAuthorize("hasRole('POLITICIAN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get current politician's updates")
    public ResponseEntity<ApiResponse<List<UpdateDTO>>> getMyUpdates() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(updateService.getUpdatesByPolitician(politicianId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('POLITICIAN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update an update")
    public ResponseEntity<ApiResponse<UpdateDTO>> updateUpdate(@PathVariable Long id,
            @Valid @RequestBody CreateUpdateRequest request) {
        Long politicianId = authFacade.getCurrentUserId();
        UpdateDTO update = updateService.updateUpdate(id, request, politicianId);
        return ResponseEntity.ok(ApiResponse.success("Update edited successfully", update));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('POLITICIAN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Delete update")
    public ResponseEntity<ApiResponse<Void>> deleteUpdate(@PathVariable Long id) {
        Long politicianId = authFacade.getCurrentUserId();
        updateService.deleteUpdate(id, politicianId);
        return ResponseEntity.ok(ApiResponse.success("Update deleted successfully", null));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Admin delete update")
    public ResponseEntity<ApiResponse<Void>> adminDeleteUpdate(@PathVariable Long id) {
        updateService.adminDeleteUpdate(id);
        return ResponseEntity.ok(ApiResponse.success("Update deleted successfully", null));
    }
}
