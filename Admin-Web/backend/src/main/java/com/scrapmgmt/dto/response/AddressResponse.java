package com.scrapmgmt.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {

    private Integer id;
    private Integer userId;
    private String type;
    private String address;
    private String houseNo;
    private String area;
    private String pincode;
    private String landmark;
    private Boolean isDefault;
}
