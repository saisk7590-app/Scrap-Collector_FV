package com.scrapmgmt.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScrapCategoryResponse {

    private Integer id;
    private String name;
    private String iconName;
    private String iconBg;
    private String cardBg;
    private LocalDateTime createdAt;
}
