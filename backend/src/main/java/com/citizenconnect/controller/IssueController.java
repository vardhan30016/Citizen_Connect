package com.citizenconnect.controller;

import com.citizenconnect.dto.ApiResponse;
import com.citizenconnect.dto.CreateIssueRequest;
import com.citizenconnect.dto.IssueDTO;
import com.citizenconnect.entity.IssueStatus;
import com.citizenconnect.security.AuthenticationFacade;
import com.citizenconnect.service.IssueService;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@Tag(name = "Issues", description = "Issue management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class IssueController {

    private final IssueService issueService;
    private final AuthenticationFacade authFacade;

    public IssueController(IssueService issueService, AuthenticationFacade authFacade) {
        this.issueService = issueService;
        this.authFacade = authFacade;
    }

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    @Operation(summary = "Create new issue")
    public ResponseEntity<ApiResponse<IssueDTO>> createIssue(@Valid @RequestBody CreateIssueRequest request) {
        Long citizenId = authFacade.getCurrentUserId();
        IssueDTO issue = issueService.createIssue(request, citizenId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Issue created successfully", issue));
    }

    @GetMapping
    @Operation(summary = "Get all issues")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getAllIssues() {
        return ResponseEntity.ok(ApiResponse.success(issueService.getAllIssues()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get issue by ID")
    public ResponseEntity<ApiResponse<IssueDTO>> getIssueById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(issueService.getIssueById(id)));
    }

    @GetMapping("/my-issues")
    @PreAuthorize("hasRole('CITIZEN')")
    @Operation(summary = "Get current citizen's issues")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getMyIssues() {
        Long citizenId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(issueService.getIssuesByCitizen(citizenId)));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('POLITICIAN')")
    @Operation(summary = "Get issues assigned to current politician")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getAssignedIssues() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(issueService.getIssuesByPolitician(politicianId)));
    }

    @GetMapping("/politician/dashboard")
    @PreAuthorize("hasRole('POLITICIAN')")
    @Operation(summary = "Get issues for politician dashboard (assigned + constituency-based)")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getPoliticianDashboardIssues() {
        Long politicianId = authFacade.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(issueService.getIssuesForPoliticianDashboard(politicianId)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get issues by status")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> getIssuesByStatus(@PathVariable IssueStatus status) {
        return ResponseEntity.ok(ApiResponse.success(issueService.getIssuesByStatus(status)));
    }

    @GetMapping("/paged")
    @Operation(summary = "Get issues with pagination")
    public ResponseEntity<ApiResponse<Page<IssueDTO>>> getIssuesWithPaging(
            @RequestParam(required = false) IssueStatus status, @PageableDefault(size = 10) Pageable pageable) {
        Page<IssueDTO> issues = issueService.getIssuesWithPaging(status != null ? status : IssueStatus.OPEN, pageable);
        return ResponseEntity.ok(ApiResponse.success(issues));
    }

    @GetMapping("/search")
    @Operation(summary = "Search issues")
    public ResponseEntity<ApiResponse<List<IssueDTO>>> searchIssues(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(issueService.searchIssues(keyword)));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @Operation(summary = "Assign issue to politician")
    public ResponseEntity<ApiResponse<IssueDTO>> assignIssue(@PathVariable Long id, @RequestParam Long politicianId) {
        Long assignerId = authFacade.getCurrentUserId();
        IssueDTO issue = issueService.assignToPolitician(id, politicianId, assignerId);
        return ResponseEntity.ok(ApiResponse.success("Issue assigned successfully", issue));
    }

    @PutMapping("/{id}/respond")
    @PreAuthorize("hasRole('POLITICIAN')")
    @Operation(summary = "Respond to issue")
    public ResponseEntity<ApiResponse<IssueDTO>> respondToIssue(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Long politicianId = authFacade.getCurrentUserId();
        String response = request.get("response");
        IssueDTO issue = issueService.respondToIssue(id, response, politicianId);
        return ResponseEntity.ok(ApiResponse.success("Response added successfully", issue));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('POLITICIAN')")
    @Operation(summary = "Resolve issue")
    public ResponseEntity<ApiResponse<IssueDTO>> resolveIssue(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        Long politicianId = authFacade.getCurrentUserId();
        String resolutionNotes = request.get("resolutionNotes");
        IssueDTO issue = issueService.resolveIssue(id, resolutionNotes, politicianId);
        return ResponseEntity.ok(ApiResponse.success("Issue resolved successfully", issue));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @Operation(summary = "Update issue status")
    public ResponseEntity<ApiResponse<IssueDTO>> updateIssueStatus(@PathVariable Long id,
            @RequestParam IssueStatus status) {
        IssueDTO issue = issueService.updateIssueStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Issue status updated", issue));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete issue")
    public ResponseEntity<ApiResponse<Void>> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.ok(ApiResponse.success("Issue deleted successfully", null));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
    @Operation(summary = "Get issue statistics")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getIssueStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("open", issueService.countByStatus(IssueStatus.OPEN));
        stats.put("inProgress", issueService.countByStatus(IssueStatus.IN_PROGRESS));
        stats.put("resolved", issueService.countByStatus(IssueStatus.RESOLVED));
        stats.put("closed", issueService.countByStatus(IssueStatus.CLOSED));
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
