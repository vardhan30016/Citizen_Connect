package com.citizenconnect.service;

import com.citizenconnect.dto.CommentDTO;
import com.citizenconnect.dto.CreateCommentRequest;
import com.citizenconnect.entity.Comment;
import com.citizenconnect.entity.Issue;
import com.citizenconnect.entity.User;
import com.citizenconnect.exception.ResourceNotFoundException;
import com.citizenconnect.exception.UnauthorizedException;
import com.citizenconnect.repository.CommentRepository;
import com.citizenconnect.repository.IssueRepository;
import com.citizenconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, IssueRepository issueRepository,
            UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
    }

    public CommentDTO createComment(Long issueId, CreateCommentRequest request, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setIssue(issue);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);
        return mapToDTO(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByIssue(Long issueId) {
        return commentRepository.findByIssueIdOrderByCreatedAtAsc(issueId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getFlaggedComments() {
        return commentRepository.findByFlaggedTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CommentDTO flagComment(Long id, String reason) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", id));
        comment.setFlagged(true);
        comment.setFlagReason(reason);
        Comment updatedComment = commentRepository.save(comment);
        return mapToDTO(updatedComment);
    }

    public CommentDTO unflagComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", id));
        comment.setFlagged(false);
        comment.setFlagReason(null);
        Comment updatedComment = commentRepository.save(comment);
        return mapToDTO(updatedComment);
    }

    public void deleteComment(Long id, Long userId, boolean isModeratorOrAdmin) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", id));

        if (!isModeratorOrAdmin && !comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own comments");
        }
        commentRepository.deleteById(id);
    }

    private CommentDTO mapToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setFlagged(comment.isFlagged());
        dto.setFlagReason(comment.getFlagReason());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setIssueId(comment.getIssue().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getFullName());
        dto.setUserRole(comment.getUser().getRole().name());
        return dto;
    }
}
