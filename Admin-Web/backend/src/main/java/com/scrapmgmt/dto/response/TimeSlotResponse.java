package com.scrapmgmt.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotResponse {

    private Integer id;
    private String slotText;
    private Boolean isActive;
}
