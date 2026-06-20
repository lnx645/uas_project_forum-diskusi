package com.uas.mardira_forum.controllers;

import com.uas.mardira_forum.dto.AuthResponseDto;
import com.uas.mardira_forum.dto.LoginRequestDto;
import com.uas.mardira_forum.dto.RegisterRequestDto;
import com.uas.mardira_forum.model.CustomUserDetails;
import com.uas.mardira_forum.model.User;
import com.uas.mardira_forum.repository.UserRepository;
import com.uas.mardira_forum.services.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

// Import dokumentasi OpenAPI
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Controller", description = "Endpoint untuk manajemen pendaftaran akun (Register) dan masuk sistem (Login) menggunakan JWT Token.")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    @Operation(summary = "Pendaftaran akun user baru", description = "Mendaftarkan mahasiswa atau dosen baru ke database forum. Kata sandi otomatis dienkripsi dengan BCrypt.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Akun berhasil didaftarkan", 
            content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
        @ApiResponse(responseCode = "403", description = "Gagal, username sudah terpakai oleh akun lain", 
            content = @Content(schema = @Schema(implementation = AuthResponseDto.class)))
    })
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterRequestDto registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity
                    .status(403)
                    .body(AuthResponseDto.builder()
                            .status("Gagal")
                            .message("Username telah didaftarkan").build());
        }

        User newUser = new User();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());

        userRepository.save(newUser);

        return ResponseEntity.ok(AuthResponseDto.builder().status("OK").message("Berhasil Mendaftarkan akun").build());
    }

    @PostMapping("/login")
    @Operation(summary = "Autentikasi masuk pengguna", description = "Memverifikasi kredensial username dan password. Mengembalikan JWT Bearer Token jika kredensial valid.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Proses login sukses dan token berhasil dicetak", 
            content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
        @ApiResponse(responseCode = "403", description = "Autentikasi gagal, kredensial tidak valid", 
            content = @Content(schema = @Schema(implementation = AuthResponseDto.class)))
    })
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
                String token = jwtUtil.generateToken(
                        userDetails.getUsername(),
                        userDetails.getId(),
                        userDetails.getEmail());
                return ResponseEntity.ok(AuthResponseDto.builder()
                        .status("200")
                        .message("Login Berhasil")
                        .token(token)
                        .build());
            }
        } catch (Exception e) {
            // Ditangani di blok catch jika token bad credentials dilempar oleh AuthenticationManager
            return ResponseEntity
                    .status(403)
                    .body(AuthResponseDto.builder()
                            .status("Gagal")
                            .message("Username atau password salah").build());
        }

        return ResponseEntity
                .status(403)
                .body(AuthResponseDto.builder()
                        .status("Gagal")
                        .message("Username atau password salah").build());
    }
}