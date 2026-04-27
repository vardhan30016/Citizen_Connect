package com.citizenconnect.entity;

/**
 * Enum representing user roles in the system.
 * Used for role-based access control with Spring Security.
 */
public enum Role {
    ADMIN,
    CITIZEN,
    POLITICIAN,
    MODERATOR
}
