package com.uas.mardira_forum.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.uas.mardira_forum.dto.TagRequestDto;
import com.uas.mardira_forum.dto.TagResponseDto;
import com.uas.mardira_forum.model.Tags;
import com.uas.mardira_forum.repository.TagRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class TagMessageController {
    private final TagRepository tagRepository;

    @MessageMapping("/tag.create")
    @SendTo("/topic/tags")
    public TagResponseDto broadcastNewTag(@Valid TagRequestDto request) {
        
        String cleanName = request.getName().toLowerCase().trim();
        
        Tags tag = tagRepository.findByName(cleanName)
                .orElseGet(() -> tagRepository.save(
                    Tags.builder()
                        .name(cleanName)
                        .description(request.getDescription())
                        .build()
                ));

        return new TagResponseDto(
            tag.getId(),
            tag.getName(),
            tag.getDescription(),
            tag.getQuestionCount(),
            tag.getCreatedAt()
        );
    }
}
