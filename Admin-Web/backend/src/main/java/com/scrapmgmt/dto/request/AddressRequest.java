package com.scrapmgmt.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {

    private Integer userId;

    private String type;

    @NotBlank(message = "Address is required")
    private String address;

    private String houseNo;
    private String area;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private String landmark;
    private Boolean isDefault;
}
