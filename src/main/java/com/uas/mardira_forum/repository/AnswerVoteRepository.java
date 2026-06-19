package com.uas.mardira_forum.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uas.mardira_forum.model.Answer;
import com.uas.mardira_forum.model.User;
import com.uas.mardira_forum.model.VoteAnswer;
@Repository
public interface AnswerVoteRepository extends JpaRepository<VoteAnswer,Long> {
        Optional<VoteAnswer> findByUserAndAnswer(User user, Answer answer);

}
