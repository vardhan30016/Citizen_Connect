package com.citizenconnect.security;

import com.citizenconnect.entity.User;
import com.citizenconnect.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFacade {

    private final UserRepository userRepository;

    public AuthenticationFacade(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getCurrentUserEmail() {
        Authentication auth = getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    public Long getCurrentUserId() {
        String email = getCurrentUserEmail();
        if (email == null)
            return null;
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElse(null);
    }

    public User getCurrentUser() {
        String email = getCurrentUserEmail();
        if (email == null)
            return null;
        return userRepository.findByEmail(email).orElse(null);
    }

    public boolean isModeratorOrAdmin() {
        Authentication auth = getAuthentication();
        if (auth == null)
            return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_MODERATOR"));
    }
}
