package com.uas.mardira_forum.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionAnswerRequestDto {
    @NotBlank(message = "Nama tag tidak boleh kosong")
    @Size(max = 50, message = "Nama tag maksimal 50 karakter")
    private String content;
    private String id;
}
