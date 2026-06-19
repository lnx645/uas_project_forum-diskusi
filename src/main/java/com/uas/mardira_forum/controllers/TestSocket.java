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

@RestController
public class TestSocket {

    // 1. Inject template broker WebSocket bawaan Spring
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/api/me")
    public ResponseEntity<?> test(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(UserResponseDTO.builder().email(user.getEmail()).name(user.getName())
                .username(user.getUsername()).id(user.getId()).accountNonExpired(user.isAccountNonExpired())
                .accountNonLocked(user.isAccountNonLocked()).credentialsNonExpired(user.isCredentialsNonExpired())
                .enabled(user.isEnabled())
                .reputation(user.getReputation())
                .avatar(user.getAvatar())
                .build());
    }

    // 2. Endpoint REST API untuk simulasi broadcast
    @PostMapping("/api/test-broadcast")
    public ResponseEntity<?> testBroadcast(@RequestBody PostMessageDto payload, Principal principal) {

        // Ambil nama user dari token JWT REST API (jika ada)
        String sender = (principal != null) ? principal.getName() : "Sistem_Tester";
        payload.setTitle(sender);

        // 3. Kirim data secara realtime ke broker WebSocket tujuan
        // Semua client React yang subscribe ke '/topic/posts' akan langsung menerima
        // objek ini
        messagingTemplate.convertAndSend("/topic/posts", payload);

        // Respon balik untuk HTTP Client (Postman)
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Data berhasil disiarkan secara realtime ke WebSocket!");
        response.put("data_sent", payload);

        return ResponseEntity.ok(response);
    }
}