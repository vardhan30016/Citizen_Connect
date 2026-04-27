package com.citizenconnect.controller;

import com.citizenconnect.dto.ApiResponse;
import com.citizenconnect.dto.CreateFeedbackRequest;
import com.citizenconnect.dto.FeedbackDTO;
import com.citizenconnect.security.AuthenticationFacade;
import com.citizenconnect.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@Tag(name = "Feedback", description = "Citizen feedback on politicians")
@SecurityRequirement(name = "Bearer Authentication")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final AuthenticationFacade authFacade;

    public FeedbackController(FeedbackService feedbackService, AuthenticationFacade authFacade) {
        this.feedbackService = feedbackService;
        this.authFacade = authFacade;
    }

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    @Operation(summary = "Submit feedback")
    public ResponseEntity<ApiResponse<FeedbackDTO>> submitFeedback(@Valid @RequestBody CreateFeedbackRequest request) {
        Long citizenId = authFacade.getCurrentUserId();
        FeedbackDTO feedback = feedbackService.createFeedback(request, citizenId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback submitted successfully", feedback));
    }

    @GetMapping("/politician/{politicianId}")
    @Operation(summary = "Get feedback for a politician")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getFeedbackByPolitician(@PathVariable Long politicianId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbackByPolitician(politicianId)));
    }

    @GetMapping("/politician/{politicianId}/stats")
    @Operation(summary = "Get feedback statistics for a politician")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPoliticianStats(@PathVariable Long politicianId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getPoliticianStats(politicianId)));
    }

    @GetMapping("/politician/{politicianId}/average")
    @Operation(summary = "Get average rating for a politician")
    public ResponseEntity<ApiResponse<Double>> getAverageRating(@PathVariable Long politicianId) {
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getAverageRating(politicianId)));
    }

    @GetMapping("/my-feedback")
    @PreAuthorize("hasRole('CITIZEN')")
    @Operation(summary = "Get feedback submitted by current citizen")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getMyFeedback() {
        Long citizenId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbackByCitizen(citizenId)));
    }

    @GetMapping("/received")
    @PreAuthorize("hasRole('POLITICIAN')")
    @Operation(summary = "Get feedback received by current politician")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getReceivedFeedback() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(feedbackService.getFeedbackByPolitician(politicianId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete feedback")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.success("Feedback deleted successfully", null));
    }
}
