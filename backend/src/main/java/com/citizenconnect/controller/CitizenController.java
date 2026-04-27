package com.citizenconnect.controller;

import com.citizenconnect.dto.ApiResponse;
import com.citizenconnect.dto.IssueDTO;
import com.citizenconnect.dto.FeedbackDTO;
import com.citizenconnect.dto.UpdateDTO;
import com.citizenconnect.security.AuthenticationFacade;
import com.citizenconnect.service.CitizenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citizen")
@Tag(name = "Citizen", description = "Citizen dashboard and self-service endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenController {

    private final CitizenService citizenService;
    private final AuthenticationFacade authFacade;

    public CitizenController(CitizenService citizenService, AuthenticationFacade authFacade) {
        this.citizenService = citizenService;
        this.authFacade = authFacade;
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get citizen dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Long citizenId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(citizenService.getDashboardStats(citizenId)));
    }

    @GetMapping("/my-issues")
    @Operation(summary = "Get issues submitted by the current citizen")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getMyIssues() {
        Long citizenId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(citizenService.getMyIssues(citizenId)));
    }

    @GetMapping("/my-feedback")
    @Operation(summary = "Get feedback submitted by the current citizen")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getMyFeedback() {
        Long citizenId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(citizenService.getMyFeedback(citizenId)));
    }

    @GetMapping("/constituency-updates")
    @Operation(summary = "Get updates from politicians in the citizen's constituency")
    public ResponseEntity<ApiResponse<List<UpdateDTO>>> getConstituencyUpdates() {
        Long citizenId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(citizenService.getConstituencyUpdates(citizenId)));
    }
}
