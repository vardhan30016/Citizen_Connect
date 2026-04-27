package com.citizenconnect.service;

import com.citizenconnect.dto.IssueDTO;
import com.citizenconnect.dto.UpdateDTO;
import com.citizenconnect.dto.FeedbackDTO;
import com.citizenconnect.entity.*;
import com.citizenconnect.exception.ResourceNotFoundException;
import com.citizenconnect.repository.IssueRepository;
import com.citizenconnect.repository.FeedbackRepository;
import com.citizenconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CitizenService {

    private final IssueRepository issueRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public CitizenService(IssueRepository issueRepository, FeedbackRepository feedbackRepository, 
                          UserRepository userRepository) {
        this.issueRepository = issueRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats(Long citizenId) {
        // Role is already enforced via @PreAuthorize("hasRole('CITIZEN')") on the controller
        userRepository.findById(citizenId)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen", "id", citizenId));

        Map<String, Object> stats = new HashMap<>();
        List<Issue> myIssues = issueRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
        List<Feedback> myFeedback = feedbackRepository.findByCitizenId(citizenId);

        long openIssues = myIssues.stream()
                .filter(i -> i.getStatus() == IssueStatus.OPEN)
                .count();
        long resolvedIssues = myIssues.stream()
                .filter(i -> i.getStatus() == IssueStatus.RESOLVED)
                .count();

        stats.put("totalIssuesSubmitted", (long) myIssues.size());
        stats.put("openIssues", openIssues);
        stats.put("resolvedIssues", resolvedIssues);
        stats.put("totalFeedbackSubmitted", (long) myFeedback.size());

        return stats;
    }

    @Transactional(readOnly = true)
    public List<IssueDTO> getMyIssues(Long citizenId) {
        return issueRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId).stream()
                .map(this::mapIssueToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackDTO> getMyFeedback(Long citizenId) {
        return feedbackRepository.findByCitizenId(citizenId).stream()
                .map(this::mapFeedbackToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UpdateDTO> getConstituencyUpdates(Long citizenId) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen", "id", citizenId));

        String constituency = citizen.getConstituency();
        if (constituency == null || constituency.isEmpty()) {
            return List.of();
        }

        List<User> politicians = userRepository.findPoliticiansByConstituency(constituency);
        return politicians.stream()
                .flatMap(p -> p.getUpdates().stream())
                .map(this::mapUpdateToDTO)
                .collect(Collectors.toList());
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
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setCategory(feedback.getCategory());
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
        if (update.getPolitician() != null) {
            dto.setPoliticianId(update.getPolitician().getId());
            dto.setPoliticianName(update.getPolitician().getFullName());
        }
        return dto;
    }
}
