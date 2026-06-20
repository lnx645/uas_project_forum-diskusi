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

import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionRestController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<com.uas.mardira_forum.dto.QuestionPageResponseDto> get(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "Newest") String filter,
            @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(questionService.getQuestionsPaginated(page, size, filter, tag));
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
    public ResponseEntity<?> createQuestion(@AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody QuestionRequestDto request) {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable UUID id) {

        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kamu harus login terlebih dahulu");
        }

        try {
            questionService.deleteQuestion(id, principal.getId());
            return ResponseEntity.ok("Pertanyaan berhasil dihapus");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}