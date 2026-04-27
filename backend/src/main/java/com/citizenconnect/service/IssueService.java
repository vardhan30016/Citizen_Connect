package com.citizenconnect.service;

import com.citizenconnect.dto.CreateIssueRequest;
import com.citizenconnect.dto.IssueDTO;
import com.citizenconnect.entity.Issue;
import com.citizenconnect.entity.IssueStatus;
import com.citizenconnect.entity.Role;
import com.citizenconnect.entity.User;
import com.citizenconnect.exception.BadRequestException;
import com.citizenconnect.exception.ResourceNotFoundException;
import com.citizenconnect.exception.UnauthorizedException;
import com.citizenconnect.repository.CommentRepository;
import com.citizenconnect.repository.IssueRepository;
import com.citizenconnect.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final EmailService emailService;

    public IssueService(IssueRepository issueRepository, UserRepository userRepository,
            CommentRepository commentRepository, EmailService emailService) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.emailService = emailService;
    }

    public IssueDTO createIssue(CreateIssueRequest request, Long citizenId) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", citizenId));

        if (citizen.getRole() != Role.CITIZEN) {
            throw new BadRequestException("Only citizens can create issues");
        }

        Issue issue = new Issue();
        issue.setTitle(request.getTitle());
        issue.setDescription(request.getDescription());
        issue.setCategory(request.getCategory());
        issue.setLocation(request.getLocation());
        issue.setStatus(IssueStatus.OPEN);
        issue.setCitizen(citizen);

        if (request.getAssignedPoliticianId() != null) {
            User politician = userRepository.findById(request.getAssignedPoliticianId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Politician", "id", request.getAssignedPoliticianId()));
            if (politician.getRole() != Role.POLITICIAN) {
                throw new BadRequestException("Can only assign issues to politicians");
            }
            issue.setAssignedPolitician(politician);
        }

        Issue savedIssue = issueRepository.save(issue);
        return mapToDTO(savedIssue);
    }

    @Transactional(readOnly = true)
    public IssueDTO getIssueById(Long id) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", id));
        return mapToDTO(issue);
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getAllIssues() {
        return issueRepository.findAllOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesByCitizen(Long citizenId) {
        return issueRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesByPolitician(Long politicianId) {
        return issueRepository.findByPoliticianOrderByPriority(politicianId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesForPoliticianDashboard(Long politicianId) {
        User politician = userRepository.findById(politicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Politician", "id", politicianId));

        if (politician.getRole() != Role.POLITICIAN) {
            throw new BadRequestException("Only politicians can access this endpoint");
        }

        // Return ALL issues sorted by status and date
        return issueRepository.findAllOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesByStatus(IssueStatus status) {
        return issueRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<IssueDTO> getIssuesWithPaging(IssueStatus status, Pageable pageable) {
        return issueRepository.findByStatusWithPaging(status, pageable).map(this::mapToDTO);
    }

    public IssueDTO assignToPolitician(Long issueId, Long politicianId, Long assignerId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId));

        User politician = userRepository.findById(politicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Politician", "id", politicianId));

        if (politician.getRole() != Role.POLITICIAN) {
            throw new BadRequestException("Can only assign issues to politicians");
        }

        issue.setAssignedPolitician(politician);
        issue.setStatus(IssueStatus.IN_PROGRESS);
        Issue updatedIssue = issueRepository.save(issue);

        emailService.sendIssueAssignmentNotification(politician.getEmail(), issue.getTitle());
        return mapToDTO(updatedIssue);
    }

    public IssueDTO respondToIssue(Long issueId, String response, Long politicianId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId));

        if (issue.getAssignedPolitician() == null || !issue.getAssignedPolitician().getId().equals(politicianId)) {
            throw new UnauthorizedException("You are not assigned to this issue");
        }

        issue.setResponse(response);
        issue.setStatus(IssueStatus.IN_PROGRESS);
        Issue updatedIssue = issueRepository.save(issue);

        emailService.sendIssueResponseNotification(issue.getCitizen().getEmail(), issue.getTitle(), response);
        return mapToDTO(updatedIssue);
    }

    public IssueDTO resolveIssue(Long issueId, String resolutionNotes, Long politicianId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId));

        if (issue.getAssignedPolitician() == null || !issue.getAssignedPolitician().getId().equals(politicianId)) {
            throw new UnauthorizedException("You are not assigned to this issue");
        }

        issue.setResolutionNotes(resolutionNotes);
        issue.setStatus(IssueStatus.RESOLVED);
        issue.setResolvedAt(LocalDateTime.now());

        Issue updatedIssue = issueRepository.save(issue);
        return mapToDTO(updatedIssue);
    }

    public IssueDTO updateIssueStatus(Long issueId, IssueStatus status) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId));

        issue.setStatus(status);
        if (status == IssueStatus.RESOLVED || status == IssueStatus.CLOSED) {
            issue.setResolvedAt(LocalDateTime.now());
        }
        Issue updatedIssue = issueRepository.save(issue);
        return mapToDTO(updatedIssue);
    }

    public void deleteIssue(Long issueId) {
        if (!issueRepository.existsById(issueId)) {
            throw new ResourceNotFoundException("Issue", "id", issueId);
        }
        issueRepository.deleteById(issueId);
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> searchIssues(String keyword) {
        return issueRepository.searchByKeyword(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Long countByStatus(IssueStatus status) {
        return issueRepository.countByStatus(status);
    }

    private IssueDTO mapToDTO(Issue issue) {
        IssueDTO dto = new IssueDTO();
        dto.setId(issue.getId());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setCategory(issue.getCategory());
        dto.setLocation(issue.getLocation());
        dto.setStatus(issue.getStatus());
        dto.setResponse(issue.getResponse());
        dto.setResolutionNotes(issue.getResolutionNotes());
        dto.setCitizenId(issue.getCitizen().getId());
        dto.setCitizenName(issue.getCitizen().getFullName());
        dto.setCreatedAt(issue.getCreatedAt());
        dto.setResolvedAt(issue.getResolvedAt());

        if (issue.getAssignedPolitician() != null) {
            dto.setAssignedPoliticianId(issue.getAssignedPolitician().getId());
            dto.setAssignedPoliticianName(issue.getAssignedPolitician().getFullName());
        }

        Long commentCount = commentRepository.countByIssueId(issue.getId());
        dto.setCommentCount(commentCount != null ? commentCount.intValue() : 0);

        return dto;
    }
}
