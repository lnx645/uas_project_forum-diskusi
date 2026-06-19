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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
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

        return ResponseEntity.ok(AuthResponseDto.builder().status("OK").message("Berhail Mendaftarkan akun").build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto authRequest) {
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
        } else {
            return ResponseEntity
                    .status(403)
                    .body(AuthResponseDto.builder()
                            .status("Gagal")
                            .message("Username telah didaftarkan").build());
        }
    }
}
