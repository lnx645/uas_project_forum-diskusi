package com.uas.mardira_forum.controllers;

import com.uas.mardira_forum.dto.QuestionRequestDto;
import com.uas.mardira_forum.dto.QuestionResponseDto;
import com.uas.mardira_forum.model.CustomUserDetails;
import com.uas.mardira_forum.services.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionRestController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<QuestionResponseDto>> get() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponseDto> getQuestionDetail(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(questionService.getQuestionDetail(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping
    public ResponseEntity<?> createQuestion(@AuthenticationPrincipal CustomUserDetails principal,@RequestBody QuestionRequestDto request ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kamu harus login terlebih dahulu");
        }

        try {
            QuestionResponseDto responseDto = questionService.createQuestion(request, principal.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/{id}/vote")
    public void vote(@AuthenticationPrincipal CustomUserDetails user,@PathVariable String qid){

    }
}