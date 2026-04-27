package com.citizenconnect.repository;

import com.citizenconnect.entity.Update;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Update entity.
 */
@Repository
public interface UpdateRepository extends JpaRepository<Update, Long> {

    List<Update> findByPoliticianId(Long politicianId);

    List<Update> findByPoliticianIdOrderByCreatedAtDesc(Long politicianId);

    List<Update> findByPoliticianIdAndPublishedTrue(Long politicianId);

    List<Update> findByPoliticianIdAndPublishedTrueOrderByCreatedAtDesc(Long politicianId);

    List<Update> findByPublishedTrueOrderByCreatedAtDesc();

    Page<Update> findByPublishedTrue(Pageable pageable);

    List<Update> findByCategory(String category);

    @Query("SELECT u FROM Update u WHERE u.published = true ORDER BY u.createdAt DESC")
    List<Update> findLatestUpdates(Pageable pageable);

    @Query("SELECT u.politician.id, COUNT(u) FROM Update u WHERE u.published = true GROUP BY u.politician.id")
    List<Object[]> countUpdatesByPolitician();

    @Modifying
    @Query("UPDATE Update u SET u.viewCount = u.viewCount + 1 WHERE u.id = :id")
    void incrementViewCount(@Param("id") Long id);
}
