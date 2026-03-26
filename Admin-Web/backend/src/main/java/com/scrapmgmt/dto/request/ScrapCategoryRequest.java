package com.scrapmgmt.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ScrapCategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    private String iconName;

    private String iconBg;

    private String cardBg;
}
