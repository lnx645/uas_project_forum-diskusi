package com.uas.mardira_forum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.uas.mardira_forum.dto.VoteRequestDto;
import com.uas.mardira_forum.model.CustomUserDetails;
import com.uas.mardira_forum.services.VoteService;

import lombok.NoArgsConstructor;

@RestController
@NoArgsConstructor
public class VoteController {
    @Autowired
    private VoteService voteService;

    @PostMapping("/api/votes")
    public String vote(@RequestBody VoteRequestDto voteRequestDto, @AuthenticationPrincipal CustomUserDetails user) {

        try {
            voteRequestDto.setUser(user);
            this.voteService.vote(voteRequestDto);
        } catch (Exception e) {
            throw e;
        }

        return "OK";
    }

}
