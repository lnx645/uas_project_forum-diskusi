package com.uas.mardira_forum.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnswerResponseDto {
    private UUID id;
    private String content;
    private int voteCount;
    private UserResponseDTO user;
    private boolean accepted;
    private UUID userId;
    private String username;
    private String name;
    private UUID questionId;
    private  LocalDateTime createdAt;
    private String avatarUrl;
}
