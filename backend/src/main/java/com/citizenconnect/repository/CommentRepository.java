package com.citizenconnect.repository;

import com.citizenconnect.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Comment entity.
 */
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByIssueId(Long issueId);
    
    List<Comment> findByIssueIdOrderByCreatedAtAsc(Long issueId);
    
    List<Comment> findByUserId(Long userId);
    
    List<Comment> findByFlaggedTrue();
    
    Long countByIssueId(Long issueId);

    @Modifying
    @Query("UPDATE Comment c SET c.flagged = true, c.flagReason = :reason WHERE c.id = :id")
    int flagComment(@Param("id") Long id, @Param("reason") String reason);

    @Modifying
    @Query("UPDATE Comment c SET c.flagged = false, c.flagReason = null WHERE c.id = :id")
    int unflagComment(@Param("id") Long id);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.issue.id = :issueId")
    void deleteByIssueId(@Param("issueId") Long issueId);
}
