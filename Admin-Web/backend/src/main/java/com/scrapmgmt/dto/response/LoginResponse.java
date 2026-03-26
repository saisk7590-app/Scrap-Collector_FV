package com.scrapmgmt.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private String name;
    private String email;
    private String role;
}
