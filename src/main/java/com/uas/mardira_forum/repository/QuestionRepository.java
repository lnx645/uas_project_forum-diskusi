package com.uas.mardira_forum.repository;

import com.uas.mardira_forum.model.Question;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
  Page<Question> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT q FROM Question q LEFT JOIN q.answers a GROUP BY q.id ORDER BY COUNT(a) DESC, q.createdAt DESC")
    Page<Question> findAllOrderByMostAnswers(Pageable pageable);

    Page<Question> findAllByOrderByViewsDesc(Pageable pageable);

    @Query("SELECT q FROM Question q LEFT JOIN q.votes v GROUP BY q.id ORDER BY COALESCE(SUM(CASE WHEN v.voteType = 1 THEN 1 ELSE 0 END), 0) DESC, q.createdAt DESC")
    Page<Question> findAllOrderByMostVotes(Pageable pageable);


    // =========================================================================
    // QUERY FILTER BERDASARKAN TAG (DENGAN CODESPONDING SORTING METHOD)
    // =========================================================================

    // 1. Newest + Tag
    @Query("SELECT q FROM Question q JOIN q.tags t WHERE LOWER(t.name) = LOWER(:tagName) ORDER BY q.createdAt DESC")
    Page<Question> findByTagNameOrderByCreatedAtDesc(@Param("tagName") String tagName, Pageable pageable);

    // 2. Active + Tag
    @Query("SELECT q FROM Question q JOIN q.tags t LEFT JOIN q.answers a WHERE LOWER(t.name) = LOWER(:tagName) GROUP BY q.id ORDER BY COUNT(a) DESC, q.createdAt DESC")
    Page<Question> findByTagNameOrderByMostAnswers(@Param("tagName") String tagName, Pageable pageable);

    // 3. Trending + Tag
    @Query("SELECT q FROM Question q JOIN q.tags t WHERE LOWER(t.name) = LOWER(:tagName) ORDER BY q.views DESC")
    Page<Question> findByTagNameOrderByViewsDesc(@Param("tagName") String tagName, Pageable pageable);

    // 4. Featured + Tag
    @Query("SELECT q FROM Question q JOIN q.tags t LEFT JOIN q.votes v WHERE LOWER(t.name) = LOWER(:tagName) GROUP BY q.id ORDER BY COALESCE(SUM(CASE WHEN v.voteType = 1 THEN 1 ELSE 0 END), 0) DESC, q.createdAt DESC")
    Page<Question> findByTagNameOrderByMostVotes(@Param("tagName") String tagName, Pageable pageable);
}