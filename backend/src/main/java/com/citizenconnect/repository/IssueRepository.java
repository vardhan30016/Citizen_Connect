package com.citizenconnect.repository;

import com.citizenconnect.entity.Issue;
import com.citizenconnect.entity.IssueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for Issue entity with JPQL queries including sorting and paging.
 */
@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    // Derived query methods
    List<Issue> findByCitizenId(Long citizenId);

    List<Issue> findByAssignedPoliticianId(Long politicianId);

    List<Issue> findByStatus(IssueStatus status);

    List<Issue> findByCategory(String category);

    List<Issue> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    // Paging and sorting with derived method
    Page<Issue> findByStatus(IssueStatus status, Pageable pageable);

    Page<Issue> findByAssignedPoliticianId(Long politicianId, Pageable pageable);

    // JPQL with aggregate functions
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.status = :status")
    Long countByStatus(@Param("status") IssueStatus status);

    @Query("SELECT i.category, COUNT(i) FROM Issue i GROUP BY i.category")
    List<Object[]> countByCategory();

    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, i.createdAt, i.resolvedAt)) FROM Issue i WHERE i.status = 'RESOLVED'")
    Double averageResolutionTimeInHours();

    // JPQL with sorting
    @Query("SELECT i FROM Issue i ORDER BY i.createdAt DESC")
    List<Issue> findAllOrderByCreatedAtDesc();

    @Query("SELECT i FROM Issue i WHERE i.assignedPolitician.id = :politicianId ORDER BY i.status ASC, i.createdAt DESC")
    List<Issue> findByPoliticianOrderByPriority(@Param("politicianId") Long politicianId);

    @Query("SELECT i FROM Issue i WHERE i.location LIKE %:constituency% ORDER BY i.status ASC, i.createdAt DESC")
    List<Issue> findByConstituency(@Param("constituency") String constituency);

    // JPQL with paging
    @Query("SELECT i FROM Issue i WHERE i.status = :status")
    Page<Issue> findByStatusWithPaging(@Param("status") IssueStatus status, Pageable pageable);

    // Update query
    @Modifying
    @Query("UPDATE Issue i SET i.status = :status WHERE i.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") IssueStatus status);

    // Search query
    @Query("SELECT i FROM Issue i WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Issue> searchByKeyword(@Param("keyword") String keyword);

    // Find issues created within date range
    @Query("SELECT i FROM Issue i WHERE i.createdAt BETWEEN :startDate AND :endDate")
    List<Issue> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
