package com.scrapmgmt.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScrapRequestResponse {

    private Integer id;
    private Integer userId;
    private String userName;
    private String items;
    private BigDecimal estimatedWeight;
    private String status;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
