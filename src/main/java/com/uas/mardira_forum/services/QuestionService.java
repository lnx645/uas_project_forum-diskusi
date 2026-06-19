package com.uas.mardira_forum.services;

import com.uas.mardira_forum.dto.AnswerResponseDto;
import com.uas.mardira_forum.dto.QuestionRequestDto;
import com.uas.mardira_forum.dto.QuestionResponseDto;
import com.uas.mardira_forum.dto.UserResponseDTO;
import com.uas.mardira_forum.model.Answer;
import com.uas.mardira_forum.model.Question;
import com.uas.mardira_forum.model.Tags;
import com.uas.mardira_forum.model.User;
import com.uas.mardira_forum.model.VoteAnswer;
import com.uas.mardira_forum.model.VoteQuestion;
import com.uas.mardira_forum.repository.QuestionRepository;
import com.uas.mardira_forum.repository.TagRepository;
import com.uas.mardira_forum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<QuestionResponseDto> getAllQuestions() {
        return questionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public QuestionResponseDto getQuestionDetail(UUID id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pertanyaan tidak ditemukan dengan ID: " + id));

        question.setViews(question.getViews() + 1);
        Question updatedQuestion = questionRepository.save(question);

        QuestionResponseDto responseDto = convertToResponseDto(updatedQuestion);

        messagingTemplate.convertAndSend("/topic/questions/" + id, responseDto);

        return responseDto;
    }

    @Transactional
    public QuestionResponseDto createQuestion(QuestionRequestDto request, UUID username) {
        User author = userRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("Sesi user tidak valid atau tidak ditemukan"));

        List<Tags> associatedTags = request.getTags().stream()
                .map(tagName -> tagRepository.findByName(tagName.toLowerCase().trim())
                        .orElseGet(() -> tagRepository.save(
                                Tags.builder().name(tagName.toLowerCase().trim()).build())))
                .collect(Collectors.toList());

        Question question = Question.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(author)
                .tags(associatedTags)
                .voteCount(0)
                .views(0)
                .build();

        Question savedQuestion = questionRepository.save(question);

        associatedTags.forEach(tag -> {
            tag.setQuestionCount((tag.getQuestionCount() == null ? 0 : tag.getQuestionCount()) + 1);
            tagRepository.save(tag);
            messagingTemplate.convertAndSend("/topic/tags", tag);
        });

        QuestionResponseDto responseDto = convertToResponseDto(savedQuestion);
        messagingTemplate.convertAndSend("/topic/questions", responseDto);
        return responseDto;
    }

    private QuestionResponseDto convertToResponseDto(Question question) {
        UserResponseDTO userDto = null;
        if (question.getUser() != null) {
            userDto = UserResponseDTO.builder()
                    .id(question.getUser().getId())
                    .username(question.getUser().getUsername())
                    .reputation(question.getUser().getReputation())
                    .name(question.getUser().getName())
                    .avatar(question.getUser().getAvatarUrl())
                    .build();
        }

        QuestionResponseDto.QuestionResponseDtoBuilder response = QuestionResponseDto.builder()
                .id(question.getId())
                .title(question.getTitle())
                .description(question.getContent())
                .voteCount(question.getVotes().stream()
                .filter(e->e.getVoteType() == 1)
                .mapToInt(VoteQuestion::getVoteType).sum())
                .viewsCount(question.getViews())
                .tags(question.getTags())
                .createdAt(question.getCreatedAt())
                .user(userDto);

        if (!Objects.isNull(question.getAnswers())) {
            response.answers(question
                    .getAnswers()
                    .stream()
                    .map(e -> {
                        return AnswerResponseDto.builder()
                                .id(e.getId())
                                .content(e.getContent())
                                .voteCount(e.getVotes()
                                .stream()
                                .mapToInt(VoteAnswer::getVoteType)
                                .sum())
                                .accepted(e.getAcceptted())
                                .user(UserResponseDTO.builder()
                                        .id(e.getUser().getId())
                                        .avatar(e.getUser().getAvatarUrl())
                                        .name(e.getUser().getName())
                                        .email(e.getUser().getEmail())
                                        .reputation(e.getUser().getReputation())
                                        .username(e.getUser().getUsername())
                                        .build())
                                .build();
                    }).toList());

                    
        }

        return response.build();
    }
}