package com.citizenconnect.repository;

import com.citizenconnect.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Feedback entity with aggregate functions.
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByCitizenId(Long citizenId);

    List<Feedback> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    List<Feedback> findByPoliticianId(Long politicianId);

    List<Feedback> findByPoliticianIdOrderByCreatedAtDesc(Long politicianId);

    // Aggregate functions
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.politician.id = :politicianId")
    Double averageRatingByPolitician(@Param("politicianId") Long politicianId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.politician.id = :politicianId")
    Long countByPolitician(@Param("politicianId") Long politicianId);

    @Query("SELECT f.rating, COUNT(f) FROM Feedback f WHERE f.politician.id = :politicianId GROUP BY f.rating ORDER BY f.rating")
    List<Object[]> ratingDistributionByPolitician(@Param("politicianId") Long politicianId);

    @Query("SELECT f.category, AVG(f.rating) FROM Feedback f WHERE f.politician.id = :politicianId GROUP BY f.category")
    List<Object[]> averageRatingByCategoryForPolitician(@Param("politicianId") Long politicianId);

    // Check if citizen already gave feedback to politician
    boolean existsByCitizenIdAndPoliticianId(Long citizenId, Long politicianId);
}
