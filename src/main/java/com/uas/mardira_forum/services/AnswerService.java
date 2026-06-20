package com.uas.mardira_forum.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uas.mardira_forum.dto.AnswerResponseDto;
import com.uas.mardira_forum.dto.QuestionAnswerRequestDto;
import com.uas.mardira_forum.dto.QuestionResponseDto;
import com.uas.mardira_forum.exception.ResourceNotFoundException;
import com.uas.mardira_forum.exception.UnauthorizedAccessException;
import com.uas.mardira_forum.model.Answer;
import com.uas.mardira_forum.model.CustomUserDetails;
import com.uas.mardira_forum.model.Question;
import com.uas.mardira_forum.model.User;
import com.uas.mardira_forum.repository.AnswerRepository;
import com.uas.mardira_forum.repository.QuestionRepository;
import com.uas.mardira_forum.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class AnswerService {
    @Autowired
    private AnswerRepository answerRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private QuestionService questionService;

    public void addAnswer(QuestionAnswerRequestDto questionAnswerRequestDto, CustomUserDetails currentUSer) {
        try {

            Question question = this.questionRepository
                    .findById(UUID.fromString(questionAnswerRequestDto.getId()))
                    .orElseThrow(() -> new RuntimeException("Question tidak ditemukan!"));
            User user = userRepository
                    .findById(currentUSer
                            .getId())
                    .orElseThrow(() -> new RuntimeException("Question tidak ditemukan!"));
            Answer answer = Answer.builder()
                    .content(questionAnswerRequestDto.getContent().trim())
                    .user(user)
                    .question(question)
                    .build();
            answerRepository.save(answer);
            this.simpMessagingTemplate.convertAndSend("/topic/questions/" + question.getId(),
                    this.questionService.getQuestionDetail(question.getId()));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Transactional
    public void deleteAnswer(UUID answerId, UUID userId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new ResourceNotFoundException("Jawaban dengan ID " + answerId + " tidak ditemukan"));

        if (!answer.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("Kamu tidak memiliki hak akses untuk menghapus jawaban ini!");
        }

        Question question = answer.getQuestion();
        UUID questionId = question.getId();
        answerRepository.delete(answer);

        answerRepository.flush();
        try {
            QuestionResponseDto updatedQuestionDto = questionService.getQuestionDetail(questionId);
            simpMessagingTemplate.convertAndSend("/topic/questions/" + questionId, updatedQuestionDto);
        } catch (Exception e) {
            System.err.println("Gagal mem-broadcast update question setelah answer dihapus: " + e.getMessage());
        }
    }

    public AnswerResponseDto getAnswerById(UUID id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jawaban dengan ID " + id + " tidak ditemukan"));
        return AnswerResponseDto.builder()
                .id(answer.getId())
                .content(answer.getContent())
                .createdAt(answer.getCreatedAt())
                .questionId(answer.getQuestion() != null ? answer.getQuestion().getId() : null)
                .userId(answer.getUser() != null ? answer.getUser().getId() : null)
                .username(answer.getUser() != null ? answer.getUser().getUsername() : null)
                .name(answer.getUser() != null ? answer.getUser().getName() : null)
                .avatarUrl(answer.getUser() != null ? answer.getUser().getAvatarUrl() : null)
                .build();
    }

    public void updateAnswerInline(UUID answerId, QuestionAnswerRequestDto requestDto, CustomUserDetails currentUser) {
        try {
            Answer answer = this.answerRepository.findById(answerId)
                    .orElseThrow(() -> new RuntimeException("Jawaban tidak ditemukan!"));
            if (!answer.getUser().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Anda tidak memiliki akses untuk mengubah jawaban ini!");
            }
            answer.setContent(requestDto.getContent().trim());
            answerRepository.save(answer);
            UUID questionId = answer.getQuestion().getId();
            this.simpMessagingTemplate.convertAndSend(
                    "/topic/questions/" + questionId,
                    this.questionService.getQuestionDetail(questionId));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}