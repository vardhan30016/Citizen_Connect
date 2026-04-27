package com.citizenconnect.service;

import com.citizenconnect.dto.CreateFeedbackRequest;
import com.citizenconnect.dto.FeedbackDTO;
import com.citizenconnect.entity.Feedback;
import com.citizenconnect.entity.Role;
import com.citizenconnect.entity.User;
import com.citizenconnect.exception.BadRequestException;
import com.citizenconnect.exception.ResourceNotFoundException;
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
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    public FeedbackDTO createFeedback(CreateFeedbackRequest request, Long citizenId) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", citizenId));

        if (citizen.getRole() != Role.CITIZEN) {
            throw new BadRequestException("Only citizens can submit feedback");
        }

        User politician = userRepository.findById(request.getPoliticianId())
                .orElseThrow(() -> new ResourceNotFoundException("Politician", "id", request.getPoliticianId()));

        if (politician.getRole() != Role.POLITICIAN) {
            throw new BadRequestException("Feedback can only be given to politicians");
        }

        Feedback feedback = new Feedback();
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setCategory(request.getCategory());
        feedback.setCitizen(citizen);
        feedback.setPolitician(politician);

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return mapToDTO(savedFeedback);
    }

    @Transactional(readOnly = true)
    public List<FeedbackDTO> getFeedbackByPolitician(Long politicianId) {
        return feedbackRepository.findByPoliticianIdOrderByCreatedAtDesc(politicianId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeedbackDTO> getFeedbackByCitizen(Long citizenId) {
        return feedbackRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(Long politicianId) {
        Double avg = feedbackRepository.averageRatingByPolitician(politicianId);
        return avg != null ? avg : 0.0;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPoliticianStats(Long politicianId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", getAverageRating(politicianId));
        stats.put("totalFeedback", feedbackRepository.countByPolitician(politicianId));
        return stats;
    }

    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new ResourceNotFoundException("Feedback", "id", id);
        }
        feedbackRepository.deleteById(id);
    }

    private FeedbackDTO mapToDTO(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setCategory(feedback.getCategory());
        dto.setCreatedAt(feedback.getCreatedAt());
        dto.setCitizenId(feedback.getCitizen().getId());
        dto.setCitizenName(feedback.getCitizen().getFullName());
        dto.setPoliticianId(feedback.getPolitician().getId());
        dto.setPoliticianName(feedback.getPolitician().getFullName());
        return dto;
    }
}
