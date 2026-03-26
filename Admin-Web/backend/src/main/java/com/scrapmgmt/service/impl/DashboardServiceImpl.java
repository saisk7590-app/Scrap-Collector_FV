package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.response.DashboardStatsResponse;
import com.scrapmgmt.entity.enums.PickupStatus;
import com.scrapmgmt.entity.enums.ScrapRequestStatus;
import com.scrapmgmt.repository.PickupRepository;
import com.scrapmgmt.repository.ScrapRequestRepository;
import com.scrapmgmt.repository.UserRepository;
import com.scrapmgmt.repository.RoleRepository;
import com.scrapmgmt.entity.Role;
import com.scrapmgmt.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final PickupRepository pickupRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ScrapRequestRepository requestRepository;

    @Override
    public DashboardStatsResponse getStats() {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);
        var startOfToday = today.atStartOfDay();
        var startOfTomorrow = today.plusDays(1).atStartOfDay();

        long todayPickups = pickupRepository.countCreatedAtRange(startOfToday, startOfTomorrow);
        long completedToday = pickupRepository.countByStatusAndCreatedAtRange(PickupStatus.completed, startOfToday, startOfTomorrow);
        long pendingPickups = pickupRepository.countByStatus(PickupStatus.scheduled);
        Role collectorRole = roleRepository.findByName("COLLECTOR").orElse(null);
        long totalCollectors = collectorRole != null ? userRepository.countByRole(collectorRole) : 0;
        long activeCollectors = totalCollectors;
        long pendingRequests = requestRepository.countByStatus(ScrapRequestStatus.submitted);

        var todayRevenue = pickupRepository.sumRevenueByCreatedAtRange(startOfToday, startOfTomorrow);
        var totalRevenue = pickupRepository.sumTotalRevenue();

        List<Object[]> trendData = pickupRepository.countPickupsGroupedByDate(weekAgo, today);
        List<DashboardStatsResponse.PickupTrendItem> trend = trendData.stream()
                .map(row -> DashboardStatsResponse.PickupTrendItem.builder()
                        .date(row[0].toString())
                        .count(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .todayPickups(todayPickups)
                .completedToday(completedToday)
                .pendingPickups(pendingPickups)
                .todayRevenue(todayRevenue)
                .totalRevenue(totalRevenue)
                .activeCollectors(activeCollectors)
                .totalCollectors(totalCollectors)
                .pendingRequests(pendingRequests)
                .pickupTrend(trend)
                .build();
    }
}
