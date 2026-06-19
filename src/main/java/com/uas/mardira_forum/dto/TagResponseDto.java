package com.uas.mardira_forum.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TagResponseDto {
    private UUID id;
    private String name;
    private String description;
    private Integer questionCount;
    LocalDateTime createdAt;
}
