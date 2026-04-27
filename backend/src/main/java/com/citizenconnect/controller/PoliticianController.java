package com.citizenconnect.controller;

import com.citizenconnect.dto.ApiResponse;
import com.citizenconnect.dto.IssueDTO;
import com.citizenconnect.dto.FeedbackDTO;
import com.citizenconnect.dto.UpdateDTO;
import com.citizenconnect.security.AuthenticationFacade;
import com.citizenconnect.service.PoliticianService;
import com.citizenconnect.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/politician")
@Tag(name = "Politician", description = "Politician dashboard and management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('POLITICIAN')")
public class PoliticianController {

    private final PoliticianService politicianService;
    private final AuthenticationFacade authFacade;

    public PoliticianController(PoliticianService politicianService, IssueService issueService,
                                AuthenticationFacade authFacade) {
        this.politicianService = politicianService;
        this.authFacade = authFacade;
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get politician dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(politicianService.getDashboardStats(politicianId)));
    }

    @GetMapping("/assigned-issues")
    @Operation(summary = "Get issues assigned to current politician")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getAssignedIssues() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(politicianService.getAssignedIssues(politicianId)));
    }

    @GetMapping("/dashboard-issues")
    @Operation(summary = "Get all issues for politician dashboard")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getDashboardIssues() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(politicianService.getDashboardIssues(politicianId)));
    }

    @GetMapping("/feedback-received")
    @Operation(summary = "Get feedback received from citizens")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getFeedbackReceived() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(politicianService.getReceivedFeedback(politicianId)));
    }

    @GetMapping("/rating")
    @Operation(summary = "Get average citizen rating")
    public ResponseEntity<ApiResponse<Double>> getAverageRating() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(politicianService.getAverageRating(politicianId)));
    }

    @GetMapping("/my-updates")
    @Operation(summary = "Get current politician's posted updates")
    public ResponseEntity<ApiResponse<List<UpdateDTO>>> getMyUpdates() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(politicianService.getMyUpdates(politicianId)));
    }
}
