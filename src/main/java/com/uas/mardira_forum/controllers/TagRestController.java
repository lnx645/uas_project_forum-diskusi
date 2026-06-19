package com.uas.mardira_forum.controllers;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uas.mardira_forum.dto.TagResponseDto;
import com.uas.mardira_forum.repository.TagRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagRestController {

    private final TagRepository tagRepository;

    @GetMapping
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