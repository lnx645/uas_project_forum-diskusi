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

// Import dokumentasi OpenAPI
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@NoArgsConstructor
@Tag(name = "Vote Controller", description = "Endpoint untuk mengelola sistem voting (Upvote/Downvote) pada postingan pertanyaan maupun jawaban.")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping("/api/votes")
    @Operation(summary = "Mengirimkan hak suara (Vote)", description = "Membubuhkan status upvote (+1) atau downvote (-1) pada target konten diskusi. Aksi ini mendeteksi identitas pemilih lewat token sesi aktif untuk mencegah kecurangan *double-voting*.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vote berhasil direkam/diperbarui", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "401", description = "Gagal, pengguna belum login / token tidak valid"),
            @ApiResponse(responseCode = "400", description = "Gagal memproses transaksi voting karena format data salah", content = @Content(schema = @Schema(implementation = String.class)))
    })
    public String vote(
            @RequestBody VoteRequestDto voteRequestDto,
            @Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails user) {

        try {
            voteRequestDto.setUser(user);
            this.voteService.vote(voteRequestDto);
        } catch (Exception e) {
            throw e;
        }

        return "OK";
    }
}