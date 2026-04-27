package com.citizenconnect.dto;

import com.citizenconnect.entity.Role;
import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String constituency;
    private String profileImage;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;

    public UserDTO() {
    }

    public UserDTO(Long id, String fullName, String email, String phone, String constituency,
            String profileImage, Role role, boolean enabled, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.constituency = constituency;
        this.profileImage = profileImage;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    // Builder pattern
    public static UserDTOBuilder builder() {
        return new UserDTOBuilder();
    }

    public static class UserDTOBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String constituency;
        private String profileImage;
        private Role role;
        private boolean enabled;
        private LocalDateTime createdAt;

        public UserDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserDTOBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserDTOBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public UserDTOBuilder constituency(String constituency) {
            this.constituency = constituency;
            return this;
        }

        public UserDTOBuilder profileImage(String profileImage) {
            this.profileImage = profileImage;
            return this;
        }

        public UserDTOBuilder role(Role role) {
            this.role = role;
            return this;
        }

        public UserDTOBuilder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public UserDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserDTO build() {
            return new UserDTO(id, fullName, email, phone, constituency, profileImage, role, enabled, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getConstituency() {
        return constituency;
    }

    public void setConstituency(String constituency) {
        this.constituency = constituency;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
