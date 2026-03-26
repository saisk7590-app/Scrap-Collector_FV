package com.scrapmgmt.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PickupResponse {

    private Integer id;
    private Integer scrapRequestId;
    private Integer customerId;
    private String customerName;
    private String customerPhone;
    private Integer collectorId;
    private String collectorName;
    private String collectorPhone;
    private String addressLine;
    private String city;
    private String timeSlotLabel;
    private LocalDate scheduledDate;
    private String status;
    private Integer totalQty;
    private BigDecimal totalWeight;
    private BigDecimal amount;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
