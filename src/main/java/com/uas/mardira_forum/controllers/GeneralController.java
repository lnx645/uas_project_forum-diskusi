package com.uas.mardira_forum.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.uas.mardira_forum.dto.PostMessageDto;
import com.uas.mardira_forum.dto.UserResponseDTO;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import com.uas.mardira_forum.model.*;

// Import dokumentasi OpenAPI
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "General Controller", description = "Endpoint utilitas sistem untuk pengecekan sesi profil user aktif dan pengujian broadcast WebSocket.")
public class GeneralController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/api/me")
    @Operation(summary = "Mendapatkan profil pengguna yang sedang login", description = "Mengembalikan detail data informasi akun beserta status hak akses kredensial yang diekstraksi dari token JWT aktif.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sesi aktif ditemukan, profil berhasil dimuat", 
            content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
        @ApiResponse(responseCode = "401", description = "Belum terautentikasi / token JWT tidak valid atau kedaluwarsa")
    })
    public ResponseEntity<?> test(@Parameter(hidden = true) @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(UserResponseDTO.builder().email(user.getEmail()).name(user.getName())
                .username(user.getUsername()).id(user.getId()).accountNonExpired(user.isAccountNonExpired())
                .accountNonLocked(user.isAccountNonLocked()).credentialsNonExpired(user.isCredentialsNonExpired())
                .enabled(user.isEnabled())
                .reputation(user.getReputation())
                .avatar(user.getAvatar())
                .build());
    }

    @PostMapping("/api/test-broadcast")
    @Operation(summary = "Menguji siaran data realtime (WebSocket Broadcast)", description = "Menerima payload pesan via HTTP POST, menyisipkan nama pengirim, lalu memancarkannya secara instan ke seluruh client yang berlangganan pada rute broker '/topic/posts'.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Pesan berhasil disiarkan ke broker WebSocket", 
            content = @Content(schema = @Schema(description = "Struktur Map respon status dan data terkirim")))
    })
    public ResponseEntity<?> testBroadcast(
            @RequestBody PostMessageDto payload, 
            @Parameter(hidden = true) Principal principal) {

        String sender = (principal != null) ? principal.getName() : "Sistem_Tester";
        payload.setTitle(sender);
        messagingTemplate.convertAndSend("/topic/posts", payload);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Data berhasil disiarkan secara realtime ke WebSocket!");
        response.put("data_sent", payload);

        return ResponseEntity.ok(response);
    }
}