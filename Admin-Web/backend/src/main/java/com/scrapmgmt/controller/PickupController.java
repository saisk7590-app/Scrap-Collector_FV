package com.scrapmgmt.controller;

import com.scrapmgmt.dto.request.PickupAssignRequest;
import com.scrapmgmt.dto.request.PickupRequest;
import com.scrapmgmt.dto.request.PickupStatusRequest;
import com.scrapmgmt.dto.response.ApiResponse;
import com.scrapmgmt.dto.response.PagedResponse;
import com.scrapmgmt.dto.response.PickupResponse;
import com.scrapmgmt.entity.enums.PickupStatus;
import com.scrapmgmt.exception.BadRequestException;
import com.scrapmgmt.service.PickupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@RestController
@RequestMapping("/api/pickups")
@RequiredArgsConstructor
public class PickupController {

    private final PickupService pickupService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PickupResponse>>> getPickups(
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(name = "city", required = false) String city,
            @RequestParam(name = "collectorId", required = false) Integer collectorId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "desc") String sortDir) {

        log.info("[GET /api/pickups] status={}, date={}, city={}, collectorId={}", status, date, city, collectorId);
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PickupStatus pickupStatus = null;
        if (status != null) {
            try {
                pickupStatus = PickupStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid pickup status: " + status + ". Allowed: scheduled, in_progress, completed, cancelled");
            }
        }
        return ResponseEntity.ok(ApiResponse.ok(
                PagedResponse.of(pickupService.getPickups(pickupStatus, date, city, collectorId, pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PickupResponse>> getPickupById(@PathVariable("id") Integer id) {
        log.info("[GET /api/pickups/{}] Fetching pickup", id);
        return ResponseEntity.ok(ApiResponse.ok(pickupService.getPickupById(id)));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<PickupResponse>> assignCollector(
            @PathVariable("id") Integer id, @Valid @RequestBody PickupAssignRequest request) {
        log.info("[PUT /api/pickups/{}/assign] collectorId={}", id, request.getCollectorId());
        return ResponseEntity.ok(ApiResponse.ok("Collector assigned", pickupService.assignCollector(id, request)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PickupResponse>> updateStatus(
            @PathVariable("id") Integer id, @Valid @RequestBody PickupStatusRequest request) {
        log.info("[PUT /api/pickups/{}/status] status={}", id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Status updated", pickupService.updateStatus(id, request)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PickupResponse>> createPickup(@Valid @RequestBody PickupRequest request) {
        log.info("[POST /api/pickups] userId={}, city={}", request.getUserId(), request.getCity());
        return ResponseEntity.ok(ApiResponse.ok("Pickup created", pickupService.createPickup(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PickupResponse>> updatePickup(
            @PathVariable("id") Integer id, @Valid @RequestBody PickupRequest request) {
        log.info("[PUT /api/pickups/{}] Updating pickup", id);
        return ResponseEntity.ok(ApiResponse.ok("Pickup updated", pickupService.updatePickup(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePickup(@PathVariable("id") Integer id) {
        log.info("[DELETE /api/pickups/{}] Deleting pickup", id);
        pickupService.deletePickup(id);
        return ResponseEntity.ok(ApiResponse.success("Pickup deleted"));
    }
}
