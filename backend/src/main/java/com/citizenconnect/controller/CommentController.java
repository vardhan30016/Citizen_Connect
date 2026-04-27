package com.citizenconnect.controller;

import com.citizenconnect.dto.ApiResponse;
import com.citizenconnect.dto.CommentDTO;
import com.citizenconnect.dto.CreateCommentRequest;
import com.citizenconnect.security.AuthenticationFacade;
import com.citizenconnect.service.CommentService;
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
@RequestMapping("/api/comments")
@Tag(name = "Comments", description = "Issue comments/discussion")
@SecurityRequirement(name = "Bearer Authentication")
public class CommentController {

    private final CommentService commentService;
    private final AuthenticationFacade authFacade;

    public CommentController(CommentService commentService, AuthenticationFacade authFacade) {
        this.commentService = commentService;
        this.authFacade = authFacade;
    }

    @PostMapping("/issue/{issueId}")
    @Operation(summary = "Add comment to issue")
    public ResponseEntity<ApiResponse<CommentDTO>> addComment(@PathVariable Long issueId,
            @Valid @RequestBody CreateCommentRequest request) {
        Long userId = authFacade.getCurrentUserId();
        CommentDTO comment = commentService.createComment(issueId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added successfully", comment));
    }

    @GetMapping("/issue/{issueId}")
    @Operation(summary = "Get comments for an issue")
    public ResponseEntity<ApiResponse<List<CommentDTO>>> getCommentsByIssue(@PathVariable Long issueId) {
        return ResponseEntity.ok(ApiResponse.success(commentService.getCommentsByIssue(issueId)));
    }

    @GetMapping("/flagged")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    @Operation(summary = "Get flagged comments")
    public ResponseEntity<ApiResponse<List<CommentDTO>>> getFlaggedComments() {
        return ResponseEntity.ok(ApiResponse.success(commentService.getFlaggedComments()));
    }

    @PutMapping("/{id}/flag")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    @Operation(summary = "Flag a comment")
    public ResponseEntity<ApiResponse<CommentDTO>> flagComment(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        CommentDTO comment = commentService.flagComment(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Comment flagged", comment));
    }

    @PutMapping("/{id}/unflag")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    @Operation(summary = "Unflag a comment")
    public ResponseEntity<ApiResponse<CommentDTO>> unflagComment(@PathVariable Long id) {
        CommentDTO comment = commentService.unflagComment(id);
        return ResponseEntity.ok(ApiResponse.success("Comment unflagged", comment));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete comment")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Long id) {
        Long userId = authFacade.getCurrentUserId();
        boolean isModeratorOrAdmin = authFacade.isModeratorOrAdmin();
        commentService.deleteComment(id, userId, isModeratorOrAdmin);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}
