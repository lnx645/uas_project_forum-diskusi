package com.uas.mardira_forum.controllers;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uas.mardira_forum.dto.TagResponseDto;
import com.uas.mardira_forum.repository.TagRepository;

import lombok.RequiredArgsConstructor;

// Import dokumentasi OpenAPI
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Tag(name = "Tag Controller", description = "Endpoint untuk menyajikan seluruh daftar label kategori (Tags) aktif di forum secara real-time.")
public class TagRestController {

    private final TagRepository tagRepository;

    @GetMapping
    @Operation(summary = "Mendapatkan seluruh daftar tag", description = "Mengambil daftar master kata kunci tagar dari database untuk pemetaan filter antarmuka pada sisi Front-End klien.")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", 
            description = "Daftar tag sukses dikompilasi", 
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = TagResponseDto.class)))
        )
    })
    public List<TagResponseDto> getAllTags() {
        return tagRepository.findAll().stream()
                .map(tag -> new TagResponseDto(
                        tag.getId(),
                        tag.getName(),
                        tag.getDescription(),
                        tag.getQuestionCount(),
                        tag.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}