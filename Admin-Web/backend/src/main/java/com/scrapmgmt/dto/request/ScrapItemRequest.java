package com.scrapmgmt.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ScrapItemRequest {

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    @NotBlank(message = "Item name is required")
    private String name;

    @NotNull(message = "Base price is required")
    private BigDecimal basePrice;

    @NotBlank(message = "Measurement type is required")
    private String measurementType;
}
