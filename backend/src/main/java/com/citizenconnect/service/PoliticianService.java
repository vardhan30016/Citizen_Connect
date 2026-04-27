package com.citizenconnect.service;

import com.citizenconnect.dto.IssueDTO;
import com.citizenconnect.dto.FeedbackDTO;
import com.citizenconnect.dto.UpdateDTO;
import com.citizenconnect.entity.*;
import com.citizenconnect.exception.ResourceNotFoundException;
import com.citizenconnect.repository.IssueRepository;
import com.citizenconnect.repository.FeedbackRepository;
import com.citizenconnect.repository.UpdateRepository;
import com.citizenconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PoliticianService {

    private final IssueRepository issueRepository;
    private final FeedbackRepository feedbackRepository;
    private final UpdateRepository updateRepository;
    private final UserRepository userRepository;

    public PoliticianService(IssueRepository issueRepository, FeedbackRepository feedbackRepository,
                             UpdateRepository updateRepository, UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.feedbackRepository = feedbackRepository;
        this.updateRepository = updateRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats(Long politicianId) {
        User politician = userRepository.findById(politicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Politician", "id", politicianId));

        if (politician.getRole() != Role.POLITICIAN) {
            throw new IllegalArgumentException("Only politicians can access this dashboard");
        }

        Map<String, Object> stats = new HashMap<>();
        List<Issue> assignedIssues = issueRepository.findByAssignedPoliticianId(politicianId);
        List<Feedback> receivedFeedback = feedbackRepository.findByPoliticianId(politicianId);
        List<Update> myUpdates = updateRepository.findByPoliticianId(politicianId);

        long openIssues = assignedIssues.stream()
                .filter(i -> i.getStatus() == IssueStatus.OPEN)
                .count();
        long resolvedIssues = assignedIssues.stream()
                .filter(i -> i.getStatus() == IssueStatus.RESOLVED)
                .count();

        double averageRating = receivedFeedback.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        stats.put("assignedIssues", (long) assignedIssues.size());
        stats.put("openIssues", openIssues);
        stats.put("resolvedIssues", resolvedIssues);
        stats.put("inProgressIssues", assignedIssues.stream()
                .filter(i -> i.getStatus() == IssueStatus.IN_PROGRESS)
                .count());
        stats.put("feedbackReceived", (long) receivedFeedback.size());
        stats.put("averageRating", averageRating);
        stats.put("updatesPosted", (long) myUpdates.size());

        return stats;
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getAssignedIssues(Long politicianId) {
        return issueRepository.findByPoliticianOrderByPriority(politicianId).stream()
                .map(this::mapIssueToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getDashboardIssues(Long politicianId) {
        return issueRepository.findAllOrderByCreatedAtDesc().stream()
                .map(this::mapIssueToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackDTO> getReceivedFeedback(Long politicianId) {
        return feedbackRepository.findByPoliticianId(politicianId).stream()
                .map(this::mapFeedbackToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UpdateDTO> getMyUpdates(Long politicianId) {
        return updateRepository.findByPoliticianId(politicianId).stream()
                .map(this::mapUpdateToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public double getAverageRating(Long politicianId) {
        return feedbackRepository.findByPoliticianId(politicianId).stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);
    }

    private IssueDTO mapIssueToDTO(Issue issue) {
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
        return dto;
    }

    private FeedbackDTO mapFeedbackToDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setText(feedback.getText());
        dto.setRating(feedback.getRating());
        dto.setCreatedAt(feedback.getCreatedAt());
        if (feedback.getPolitician() != null) {
            dto.setPoliticianId(feedback.getPolitician().getId());
            dto.setPoliticianName(feedback.getPolitician().getFullName());
        }
        if (feedback.getCitizen() != null) {
            dto.setCitizenId(feedback.getCitizen().getId());
            dto.setCitizenName(feedback.getCitizen().getFullName());
        }
        return dto;
    }

    private UpdateDTO mapUpdateToDTO(Update update) {
        UpdateDTO dto = new UpdateDTO();
        dto.setId(update.getId());
        dto.setTitle(update.getTitle());
        dto.setContent(update.getContent());
        dto.setCreatedAt(update.getCreatedAt());
        dto.setCreatedAt(update.getUpdatedAt());
        if (update.getPolitician() != null) {
            dto.setPoliticianId(update.getPolitician().getId());
            dto.setPoliticianName(update.getPolitician().getFullName());
        }
        return dto;
    }
}
