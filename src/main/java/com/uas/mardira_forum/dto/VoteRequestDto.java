package com.uas.mardira_forum.dto;

import com.uas.mardira_forum.model.CustomUserDetails;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoteRequestDto {
    private String targetId;
    private TargetType targetType;
    private int voteType;
    private CustomUserDetails user;


    public enum TargetType {
        QUESTION,
        ANSWER
    }
}
