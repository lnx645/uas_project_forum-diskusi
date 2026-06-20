package com.uas.mardira_forum.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/answer")
@Tag(name = "Answer Controller", description = "Endpoint untuk manajemen data jawaban (CRUD) pada forum diskusi.")
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @GetMapping("/{id}")
    @Operation(summary = "Mendapatkan detail jawaban berdasarkan ID", description = "Mengambil data lengkap satu entitas jawaban menggunakan string UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Jawaban berhasil ditemukan", content = @Content(schema = @Schema(implementation = AnswerResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Format ID Jawaban tidak valid (Bukan UUID)", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "Jawaban tidak ditemukan", content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> getAnswerById(
            @Parameter(description = "String ID Jawaban (UUID)", example = "4a8e2b8c-1234-5678-9abc-def012345678") @PathVariable String id) {
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
    @Operation(summary = "Menambahkan jawaban baru pada pertanyaan", description = "Membuat tanggapan baru terikat pada ID pertanyaan tertentu. Membutuhkan token autentikasi user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Jawaban sukses diterbitkan", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Akses ditolak, pengguna belum login")
    })
    public String addAnswer(
            @RequestBody QuestionAnswerRequestDto questionAnswerRequestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails,
            @Parameter(description = "String ID Pertanyaan tujuan (UUID)", example = "b7f9a1c2-3456-7890-abcd-ef1234567890") @PathVariable String question_id) {
        questionAnswerRequestDto.setId(question_id);
        this.answerService.addAnswer(questionAnswerRequestDto, userDetails);
        return "OKE!";
    }

    @PutMapping("/{id}")
    @Operation(summary = "Memperbarui isi konten jawaban", description = "Mengubah isi teks Markdown jawaban secara inline berdasarkan ID jawaban.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Jawaban berhasil diperbarui", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Format ID tidak valid", content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> updateAnswer(
            @Parameter(description = "String ID Jawaban yang ingin diubah", example = "4a8e2b8c-1234-5678-9abc-def012345678") @PathVariable String id,
            @RequestBody QuestionAnswerRequestDto requestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            UUID answerId = UUID.fromString(id);
            answerService.updateAnswerInline(answerId, requestDto, userDetails);
            return ResponseEntity.ok("Jawaban berhasil diperbarui");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Format ID tidak valid.");
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    @Operation(summary = "Menghapus jawaban secara permanen", description = "Menghapus entitas jawaban dari database forum. Aksi ini memvalidasi kepemilikan data melalui token sesi.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Jawaban sukses dihapus secara permanen", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Belum terotentikasi / Sesi habis", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "403", description = "Akses ditolak, Anda bukan pemilik jawaban ini", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "Target ID jawaban tidak ditemukan di database", content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> deleteAnswer(
            @Parameter(description = "String ID Jawaban yang ingin dihapus", example = "4a8e2b8c-1234-5678-9abc-def012345678") @PathVariable String id,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body("Kamu harus login terlebih dahulu");
        }

        try {
            UUID answerId = UUID.fromString(id);
            answerService.deleteAnswer(answerId, userDetails.getId());
            return ResponseEntity.ok("Jawaban berhasil dihapus");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Format ID Jawaban tidak valid.");
        } catch (com.uas.mardira_forum.exception.ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (com.uas.mardira_forum.exception.UnauthorizedAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Terjadi kesalahan internal pada server.");
        }
    }
}