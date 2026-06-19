package com.uas.mardira_forum.dto;

import lombok.Data;

@Data
public class RegisterRequestDto {
    private String username;
    private String password;
    private String name;
    private String email;
}
