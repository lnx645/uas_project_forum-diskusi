package com.uas.mardira_forum.dto;

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
}
