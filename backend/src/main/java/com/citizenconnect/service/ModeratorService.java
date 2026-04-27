package com.citizenconnect.service;

import com.citizenconnect.dto.CommentDTO;
import com.citizenconnect.dto.IssueDTO;
import com.citizenconnect.entity.Comment;
import com.citizenconnect.entity.Issue;
import com.citizenconnect.entity.IssueStatus;
import com.citizenconnect.exception.ResourceNotFoundException;
import com.citizenconnect.repository.CommentRepository;
import com.citizenconnect.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ModeratorService {

    private final IssueRepository issueRepository;
    private final CommentRepository commentRepository;

    public ModeratorService(IssueRepository issueRepository, CommentRepository commentRepository) {
        this.issueRepository = issueRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getPendingIssues() {
        return issueRepository.findByStatus(IssueStatus.OPEN).stream()
                .map(this::mapIssueToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getAllIssuesForModeration() {
        return issueRepository.findAllOrderByCreatedAtDesc().stream()
                .map(this::mapIssueToDTO)
                .collect(Collectors.toList());
    }

    public void approveIssue(Long issueId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId));
        issue.setStatus(IssueStatus.IN_PROGRESS);
        issueRepository.save(issue);
    }

    public void rejectIssue(Long issueId, String reason) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId));
        issue.setStatus(IssueStatus.CLOSED);
        issue.setResolutionNotes("Rejected: " + reason);
        issueRepository.save(issue);
    }

    public void removeComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResourceNotFoundException("Comment", "id", commentId);
        }
        commentRepository.deleteById(commentId);
    }

    public List<CommentDTO> getCommentsForModeration() {
        return commentRepository.findAll().stream()
                .map(this::mapCommentToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countPendingIssues() {
        return issueRepository.countByStatus(IssueStatus.OPEN);
    }

    private IssueDTO mapIssueToDTO(Issue issue) {
        IssueDTO dto = new IssueDTO();
        dto.setId(issue.getId());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setCategory(issue.getCategory());
        dto.setLocation(issue.getLocation());
        dto.setStatus(issue.getStatus());
        dto.setCitizenId(issue.getCitizen().getId());
        dto.setCitizenName(issue.getCitizen().getFullName());
        dto.setCreatedAt(issue.getCreatedAt());
        if (issue.getAssignedPolitician() != null) {
            dto.setAssignedPoliticianId(issue.getAssignedPolitician().getId());
            dto.setAssignedPoliticianName(issue.getAssignedPolitician().getFullName());
        }
        return dto;
    }

    private CommentDTO mapCommentToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setIssueId(comment.getIssue().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getFullName());
        return dto;
    }
}
