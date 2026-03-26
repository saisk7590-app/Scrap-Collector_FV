package com.scrapmgmt.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private BigDecimal walletBalance;
    private Boolean isActive;
    private String city;
    private String state;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
