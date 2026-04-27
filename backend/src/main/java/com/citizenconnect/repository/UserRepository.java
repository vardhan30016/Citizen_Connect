package com.citizenconnect.repository;

import com.citizenconnect.entity.Role;
import com.citizenconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity with derived query methods and JPQL queries.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Derived query methods (Spring Data JPA)
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByConstituency(String constituency);

    List<User> findByEnabledTrue();

    List<User> findByRoleAndEnabledTrue(Role role);

    // JPQL queries with named parameters
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.enabled = true")
    List<User> findActiveByRole(@Param("role") Role role);

    @Query("SELECT u FROM User u WHERE u.constituency = :constituency AND u.role = :role")
    List<User> findByConstituencyAndRole(@Param("constituency") String constituency, @Param("role") Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(@Param("role") Role role);

    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> searchByName(@Param("name") String name);

    // JPQL query with positional parameters
    @Query("SELECT u FROM User u WHERE u.role = 'POLITICIAN' AND u.constituency = :constituency")
    List<User> findPoliticiansByConstituency(@Param("constituency") String constituency);
}
