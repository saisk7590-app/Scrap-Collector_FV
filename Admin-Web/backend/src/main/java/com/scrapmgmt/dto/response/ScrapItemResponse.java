package com.scrapmgmt.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScrapItemResponse {

    private Integer id;
    private Integer categoryId;
    private String categoryName;
    private String name;
    private BigDecimal basePrice;
    private String measurementType;
    private LocalDateTime createdAt;
}
