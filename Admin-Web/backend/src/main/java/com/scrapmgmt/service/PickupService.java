package com.scrapmgmt.service;

import com.scrapmgmt.dto.request.PickupAssignRequest;
import com.scrapmgmt.dto.request.PickupRequest;
import com.scrapmgmt.dto.request.PickupStatusRequest;
import com.scrapmgmt.dto.response.PickupResponse;
import com.scrapmgmt.entity.enums.PickupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface PickupService {

    Page<PickupResponse> getPickups(PickupStatus status, LocalDate date, String city, Integer collectorId, Pageable pageable);

    PickupResponse getPickupById(Integer id);

    PickupResponse assignCollector(Integer pickupId, PickupAssignRequest request);

    PickupResponse updateStatus(Integer pickupId, PickupStatusRequest request);

    PickupResponse createPickup(PickupRequest request);

    PickupResponse updatePickup(Integer pickupId, PickupRequest request);

    void deletePickup(Integer pickupId);
}
