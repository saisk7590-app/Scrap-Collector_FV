package com.scrapmgmt.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PickupStatusRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String notes;
}
