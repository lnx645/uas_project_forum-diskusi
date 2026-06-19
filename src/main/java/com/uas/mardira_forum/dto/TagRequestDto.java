package com.uas.mardira_forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagRequestDto {

    @NotBlank(message = "Nama tag tidak boleh kosong")
    @Size(max = 50, message = "Nama tag maksimal 50 karakter")
    private String name;

    private String description;
}