package com.citizenconnect.service;

import com.citizenconnect.dto.CreateUpdateRequest;
import com.citizenconnect.dto.UpdateDTO;
import com.citizenconnect.entity.Role;
import com.citizenconnect.entity.Update;
import com.citizenconnect.entity.User;
import com.citizenconnect.exception.BadRequestException;
import com.citizenconnect.exception.ResourceNotFoundException;
import com.citizenconnect.exception.UnauthorizedException;
import com.citizenconnect.repository.UpdateRepository;
import com.citizenconnect.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UpdateService {

    private final UpdateRepository updateRepository;
    private final UserRepository userRepository;

    public UpdateService(UpdateRepository updateRepository, UserRepository userRepository) {
        this.updateRepository = updateRepository;
        this.userRepository = userRepository;
    }

    public UpdateDTO createUpdate(CreateUpdateRequest request, Long politicianId) {
        User politician = userRepository.findById(politicianId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", politicianId));

        if (politician.getRole() != Role.POLITICIAN) {
            throw new BadRequestException("Only politicians can create updates");
        }

        Update update = new Update();
        update.setTitle(request.getTitle());
        update.setContent(request.getContent());
        update.setCategory(request.getCategory());
        update.setImageUrl(request.getImageUrl());
        update.setPublished(request.isPublished());
        update.setPolitician(politician);

        Update savedUpdate = updateRepository.save(update);
        return mapToDTO(savedUpdate);
    }

    @Transactional(readOnly = true)
    public UpdateDTO getUpdateById(Long id) {
        Update update = updateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Update", "id", id));
        updateRepository.incrementViewCount(id);
        return mapToDTO(update);
    }

    @Transactional(readOnly = true)
    public List<UpdateDTO> getAllPublishedUpdates() {
        return updateRepository.findByPublishedTrueOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<UpdateDTO> getPublishedUpdatesWithPaging(Pageable pageable) {
        return updateRepository.findByPublishedTrue(pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public List<UpdateDTO> getUpdatesByPolitician(Long politicianId) {
        return updateRepository.findByPoliticianIdOrderByCreatedAtDesc(politicianId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UpdateDTO> getPublishedUpdatesByPolitician(Long politicianId) {
        return updateRepository.findByPoliticianIdAndPublishedTrueOrderByCreatedAtDesc(politicianId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public UpdateDTO updateUpdate(Long id, CreateUpdateRequest request, Long politicianId) {
        Update update = updateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Update", "id", id));

        if (!update.getPolitician().getId().equals(politicianId)) {
            throw new UnauthorizedException("You can only edit your own updates");
        }

        update.setTitle(request.getTitle());
        update.setContent(request.getContent());
        update.setCategory(request.getCategory());
        update.setImageUrl(request.getImageUrl());
        update.setPublished(request.isPublished());

        Update updatedEntity = updateRepository.save(update);
        return mapToDTO(updatedEntity);
    }

    public void deleteUpdate(Long id, Long politicianId) {
        Update update = updateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Update", "id", id));

        if (!update.getPolitician().getId().equals(politicianId)) {
            throw new UnauthorizedException("You can only delete your own updates");
        }
        updateRepository.deleteById(id);
    }

    public void adminDeleteUpdate(Long id) {
        if (!updateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Update", "id", id);
        }
        updateRepository.deleteById(id);
    }

    private UpdateDTO mapToDTO(Update update) {
        UpdateDTO dto = new UpdateDTO();
        dto.setId(update.getId());
        dto.setTitle(update.getTitle());
        dto.setContent(update.getContent());
        dto.setCategory(update.getCategory());
        dto.setImageUrl(update.getImageUrl());
        dto.setPublished(update.isPublished());
        dto.setViewCount(update.getViewCount());
        dto.setCreatedAt(update.getCreatedAt());
        dto.setPoliticianId(update.getPolitician().getId());
        dto.setPoliticianName(update.getPolitician().getFullName());
        return dto;
    }
}
