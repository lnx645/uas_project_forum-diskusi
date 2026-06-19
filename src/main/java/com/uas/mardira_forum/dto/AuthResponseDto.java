package com.uas.mardira_forum.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDto {
    public String message;
    public String status;
    public String token;
}
