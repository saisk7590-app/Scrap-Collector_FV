package com.scrapmgmt.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PickupRequest {

    @NotNull(message = "User ID is required")
    private Integer userId;

    private Integer collectorId;

    @NotBlank(message = "Items representaton is required")
    private String items;

    @NotBlank(message = "Time slot is required")
    private String timeSlot;

    @NotBlank(message = "City is required")
    private String city;

    private String status;

    private Integer totalQty;

    private BigDecimal totalWeight;

    private BigDecimal amount;
}
