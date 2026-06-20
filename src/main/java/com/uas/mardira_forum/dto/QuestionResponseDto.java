package com.uas.mardira_forum.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.uas.mardira_forum.model.Tags;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionResponseDto {
    private UUID id;
    private String title;
    private String description;
    private int voteCount;
    private int viewsCount;
    private UserResponseDTO user;
    private Set<Tags> tags;
    private LocalDateTime createdAt;
    private List<AnswerResponseDto> answers;
}
