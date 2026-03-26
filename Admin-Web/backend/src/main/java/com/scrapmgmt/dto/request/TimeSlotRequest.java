package com.scrapmgmt.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TimeSlotRequest {

    @NotBlank(message = "Slot text is required")
    private String slotText;

    private Boolean isActive;
}
