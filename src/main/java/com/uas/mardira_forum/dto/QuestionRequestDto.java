package com.uas.mardira_forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuestionRequestDto {

    @NotBlank(message = "Judul pertanyaan tidak boleh kosong!")
    @Size(min = 10, max = 255, message = "Judul minimal harus 10 karakter!")
    private String title;

    @NotBlank(message = "Isi detail pertanyaan tidak boleh kosong!")
    private String content; 

    @NotEmpty(message = "Pilih minimal satu kategori tag terkait!")
    private List<String> tags;
}