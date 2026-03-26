package com.scrapmgmt.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long todayPickups;
    private long completedToday;
    private long pendingPickups;
    private BigDecimal todayRevenue;
    private BigDecimal totalRevenue;
    private long activeCollectors;
    private long totalCollectors;
    private long pendingRequests;
    private List<PickupTrendItem> pickupTrend;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PickupTrendItem {
        private String date;
        private long count;
    }
}
