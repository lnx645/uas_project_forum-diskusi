package com.uas.mardira_forum.services;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.validator.spi.tracking.ProcessedBeansTrackingVoter.Vote;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.uas.mardira_forum.dto.VoteRequestDto;
import com.uas.mardira_forum.dto.VoteRequestDto.TargetType;
import com.uas.mardira_forum.model.Answer;
import com.uas.mardira_forum.model.Question;
import com.uas.mardira_forum.model.User;
import com.uas.mardira_forum.model.VoteAnswer;
import com.uas.mardira_forum.model.VoteQuestion;
import com.uas.mardira_forum.repository.AnswerRepository;
import com.uas.mardira_forum.repository.AnswerVoteRepository;
import com.uas.mardira_forum.repository.QuestionRepository;
import com.uas.mardira_forum.repository.QuestionVoteRepository;
import com.uas.mardira_forum.repository.UserRepository;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class VoteService {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private AnswerRepository answerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuestionVoteRepository questionVoteRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private QuestionService questionService;
    @Autowired
    private AnswerVoteRepository answerVoteRepository;

    private void voteQuestion(VoteRequestDto voteRequestDto, User user) {
        // cek
        try {
            int newVoteType = voteRequestDto.getVoteType(); // -1, 1, atau 0

            Question question = this.questionRepository
                    .findById(UUID.fromString(voteRequestDto.getTargetId()))
                    .orElseThrow(() -> new RuntimeException("Sesi user tidak valid atau tidak ditemukan"));
            Optional<VoteQuestion> existingVote = this.questionVoteRepository.findByUserAndQuestion(user, question);
            if (existingVote.isPresent()) {
                VoteQuestion exQuestion = existingVote.get();

                if (exQuestion.getVoteType() == newVoteType) {
                    this.questionVoteRepository.delete(exQuestion);
                    System.out.println("Vote dihapus (batal vote)");
                } else {
                    exQuestion.setVoteType(newVoteType);
                    this.questionVoteRepository.save(exQuestion);
                    System.out.println("Vote diubah menjadi: " + newVoteType);
                }
            } else {
                VoteQuestion vote = VoteQuestion.builder().user(user).question(question).voteType(newVoteType).build();
                this.questionVoteRepository.save(vote);
                System.out.println("Vote baru berhasil disimpan: " + newVoteType);
            }

            this.simpMessagingTemplate.convertAndSend("/topic/questions/" + question.getId(),
                    this.questionService.getQuestionDetail(question.getId()));

        } catch (Exception e) {
            throw e;
        }
    }

    private void voteAnswer(VoteRequestDto voteRequestDto, User user) {
        int newVoteType = voteRequestDto.getVoteType();
        Answer answer = this.answerRepository.findById(UUID.fromString(voteRequestDto.getTargetId()))
                .orElseThrow(() -> new RuntimeException("Sesi user tidak valid atau tidak ditemukan"));

        Optional<VoteAnswer> existingOptional = this.answerVoteRepository
                .findByUserAndAnswer(user, answer);
        try {
            if (existingOptional.isPresent()) {
                VoteAnswer voteAnswer = existingOptional.get();
                if (voteAnswer.getVoteType() == newVoteType) {
                    this.answerVoteRepository.delete(voteAnswer);
                    System.out.println("Vote dihapus (batal vote)");

                } else {
                    voteAnswer.setVoteType(newVoteType);
                    this.answerVoteRepository.save(voteAnswer);
                    System.out.println("Vote diubah menjadi: " + newVoteType);

                }
            } else {
                // buat baru
                VoteAnswer answer2 = VoteAnswer
                        .builder()
                        .answer(answer)
                        .user(user)
                        .voteType(newVoteType)
                        .build();

                this.answerVoteRepository.save(answer2);

            }
            this.simpMessagingTemplate.convertAndSend("/topic/questions/" + answer.getQuestion().getId(),
                    this.questionService.getQuestionDetail(answer.getQuestion().getId()));
        } catch (Exception e) {
            throw e;
        }
    }

    public void vote(VoteRequestDto voteRequestDto) {

        User user = this.userRepository.findByUsername(voteRequestDto.getUser().getUsername())
                .orElseThrow(() -> new RuntimeException("Sesi user tidak valid atau tidak ditemukan"));

        if (voteRequestDto.getTargetType() == TargetType.QUESTION) {
            this.voteQuestion(voteRequestDto, user);
        } else {
            this.voteAnswer(voteRequestDto, user);

        }
    }
}
