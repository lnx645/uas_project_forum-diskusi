package com.uas.mardira_forum.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class QuestionPageResponseDto {
    private List<QuestionResponseDto> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;
}