package com.scrapmgmt.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PickupAssignRequest {

    @NotNull(message = "Collector ID is required")
    private Integer collectorId;
}
