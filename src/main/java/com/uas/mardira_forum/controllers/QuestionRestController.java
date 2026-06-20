package com.uas.mardira_forum.controllers;

import com.uas.mardira_forum.dto.QuestionPageResponseDto;
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

// Import dokumentasi OpenAPI
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "Question Controller", description = "Endpoint untuk manajemen postingan pertanyaan (CRUD), sistem filter multi-tab, pagination, dan kalkulasi statistik ringkasan forum.")
public class QuestionRestController {

    private final QuestionService questionService;

    @GetMapping
    @Operation(summary = "Mendapatkan daftar pertanyaan terpaginasi dengan filter", description = "Mengambil data pertanyaan secara dinamis yang mendukung pagination, pengurutan filter (Newest, Active, Trending, Featured), serta penyaringan spesifik berdasarkan tag.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Daftar pertanyaan berhasil dimuat", content = @Content(schema = @Schema(implementation = QuestionPageResponseDto.class)))
    })
    public ResponseEntity<QuestionPageResponseDto> get(
            @Parameter(description = "Indeks halaman data yang ingin diambil (dimulai dari 0)", example = "0") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Jumlah kapasitas data per halaman", example = "15") @RequestParam(defaultValue = "15") int size,
            @Parameter(description = "Kriteria pengurutan data: Newest, Active, Trending, Featured", example = "Newest") @RequestParam(defaultValue = "Newest") String filter,
            @Parameter(description = "Menyaring pertanyaan berdasarkan nama tag (Opsional)", example = "java") @RequestParam(required = false) String tag) {
        return ResponseEntity.ok(questionService.getQuestionsPaginated(page, size, filter, tag));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Mendapatkan detail lengkap utas pertanyaan", description = "Mengambil data detail pertanyaan beserta seluruh array komentar jawaban yang terikat di dalamnya berdasarkan ID UUID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Utas pertanyaan ditemukan", content = @Content(schema = @Schema(implementation = QuestionResponseDto.class))),
            @ApiResponse(responseCode = "404", description = "ID Pertanyaan tidak ditemukan di database")
    })
    public ResponseEntity<QuestionResponseDto> getQuestionDetail(
            @Parameter(description = "String ID unik pertanyaan (UUID)", example = "b7f9a1c2-3456-7890-abcd-ef1234567890") @PathVariable UUID id) {
        try {
            return ResponseEntity.ok(questionService.getQuestionDetail(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Membuat postingan pertanyaan baru", description = "Menerbitkan utas pertanyaan akademik baru lengkap dengan array tagar label. Memerlukan token otentikasi.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pertanyaan berhasil diterbitkan", content = @Content(schema = @Schema(implementation = QuestionResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Pengguna belum login / Kredensial tidak valid", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "400", description = "Gagal memproses logika input data", content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> createQuestion(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
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
    @Operation(summary = "Menghapus postingan pertanyaan", description = "Menghapus postingan pertanyaan secara permanen dari database. Sistem akan memvalidasi apakah pengakses adalah pemilik asli thread.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pertanyaan sukses dihapus", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Belum terotentikasi ke sistem", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "403", description = "Akses ditolak, Anda bukan pemilik dari pertanyaan ini", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "404", description = "Target ID Pertanyaan tidak ditemukan", content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<?> deleteQuestion(
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails principal,
            @Parameter(description = "String ID Pertanyaan yang ingin dihapus", example = "b7f9a1c2-3456-7890-abcd-ef1234567890") @PathVariable UUID id) {

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

    @GetMapping("/stats")
    @Operation(summary = "Mendapatkan ringkasan statistik forum", description = "Menghasilkan data total perhitungan (agregat count) untuk total pertanyaan, jawaban, member aktif, serta daftar tiga tag terpopuler saat ini.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistik forum berhasil dikompilasi", content = @Content(schema = @Schema(description = "Struktur Map objek statis statistik")))
    })
    public ResponseEntity<java.util.Map<String, Object>> getForumStats() {
        java.util.Map<String, Object> stats = questionService.getForumOverviewStats();
        return ResponseEntity.ok(stats);
    }
}