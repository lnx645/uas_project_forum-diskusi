package com.uas.mardira_forum.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping; // Tambahkan import ini
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uas.mardira_forum.dto.AnswerResponseDto;
import com.uas.mardira_forum.dto.QuestionAnswerRequestDto;
import com.uas.mardira_forum.model.CustomUserDetails;
import com.uas.mardira_forum.services.AnswerService;

@RestController
@RequestMapping("/api/answer")
public class AnswerContorller {
    @Autowired
    private AnswerService answerService;

    // =========================================================================
    // GET METHHOD (Wajib ada untuk disuntikkan ke Loader React Router)
    // =========================================================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getAnswerById(@PathVariable String id) {
        try {
            UUID answerId = UUID.fromString(id);
            AnswerResponseDto answerData = this.answerService.getAnswerById(answerId); 
            return ResponseEntity.ok(answerData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Format ID Jawaban tidak valid.");
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Jawaban tidak ditemukan.");
        }
    }

    @PostMapping("/{question_id}")
    public String addAnswer(
            @RequestBody QuestionAnswerRequestDto questionAnswerRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String question_id) {
        questionAnswerRequestDto.setId(question_id);
        this.answerService.addAnswer(questionAnswerRequestDto, userDetails);

        return "OKE!";
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnswer(
            @PathVariable String id, // Ubah jadi String dulu agar tidak missmatch parsing otomatis dari string JS
            @RequestBody QuestionAnswerRequestDto requestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            UUID answerId = UUID.fromString(id);
            answerService.updateAnswerInline(answerId, requestDto, userDetails);
            return ResponseEntity.ok("Jawaban berhasil diperbarui");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Format ID tidak valid.");
        }
    }
}