package com.uas.mardira_forum.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String username;
    private String password;
}