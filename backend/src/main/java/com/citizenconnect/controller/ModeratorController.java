package com.citizenconnect.controller;

import com.citizenconnect.dto.ApiResponse;
import com.citizenconnect.dto.CommentDTO;
import com.citizenconnect.dto.IssueDTO;
import com.citizenconnect.service.ModeratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/moderator")
@Tag(name = "Moderator", description = "Moderator management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('MODERATOR')")
public class ModeratorController {

    private final ModeratorService moderatorService;

    public ModeratorController(ModeratorService moderatorService) {
        this.moderatorService = moderatorService;
    }

    @GetMapping("/issues/pending")
    @Operation(summary = "Get pending issues for moderation")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getPendingIssues() {
        return ResponseEntity.ok(ApiResponse.success(moderatorService.getPendingIssues()));
    }

    @GetMapping("/issues/all")
    @Operation(summary = "Get all issues for moderation")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getAllIssuesForModeration() {
        return ResponseEntity.ok(ApiResponse.success(moderatorService.getAllIssuesForModeration()));
    }

    @PutMapping("/issues/{id}/approve")
    @Operation(summary = "Approve issue")
    public ResponseEntity<ApiResponse<Void>> approveIssue(@PathVariable Long id) {
        moderatorService.approveIssue(id);
        return ResponseEntity.ok(ApiResponse.success("Issue approved successfully", null));
    }

    @PutMapping("/issues/{id}/reject")
    @Operation(summary = "Reject issue with reason")
    public ResponseEntity<ApiResponse<Void>> rejectIssue(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        moderatorService.rejectIssue(id, reason != null ? reason : "No reason provided");
        return ResponseEntity.ok(ApiResponse.success("Issue rejected successfully", null));
    }

    @DeleteMapping("/comments/{id}")
    @Operation(summary = "Remove inappropriate comment")
    public ResponseEntity<ApiResponse<Void>> removeComment(@PathVariable Long id) {
        moderatorService.removeComment(id);
        return ResponseEntity.ok(ApiResponse.success("Comment removed successfully", null));
    }

    @GetMapping("/comments/all")
    @Operation(summary = "Get all comments for review")
    public ResponseEntity<ApiResponse<List<CommentDTO>>> getCommentsForModeration() {
        return ResponseEntity.ok(ApiResponse.success(moderatorService.getCommentsForModeration()));
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get moderator dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getModerationStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("pendingIssues", moderatorService.countPendingIssues());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
