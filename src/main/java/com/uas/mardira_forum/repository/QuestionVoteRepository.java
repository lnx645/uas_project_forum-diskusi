package com.uas.mardira_forum.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uas.mardira_forum.model.Question;
import com.uas.mardira_forum.model.User;
import com.uas.mardira_forum.model.VoteQuestion;
@Repository
public interface QuestionVoteRepository extends JpaRepository<VoteQuestion, Long> {
    Optional<VoteQuestion> findByUserAndQuestion(User user, Question question);

}
