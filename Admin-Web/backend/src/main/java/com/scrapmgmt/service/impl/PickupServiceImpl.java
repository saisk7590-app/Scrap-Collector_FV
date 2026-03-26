package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.request.PickupAssignRequest;
import com.scrapmgmt.dto.request.PickupRequest;
import com.scrapmgmt.dto.request.PickupStatusRequest;
import com.scrapmgmt.dto.response.PickupResponse;
import com.scrapmgmt.entity.Pickup;
import com.scrapmgmt.entity.User;
import com.scrapmgmt.entity.enums.PickupStatus;
import com.scrapmgmt.exception.BadRequestException;
import com.scrapmgmt.exception.ResourceNotFoundException;
import com.scrapmgmt.mapper.PickupMapper;
import com.scrapmgmt.repository.PickupRepository;
import com.scrapmgmt.repository.UserRepository;
import com.scrapmgmt.service.PickupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PickupServiceImpl implements PickupService {

    private final PickupRepository pickupRepository;
    private final UserRepository userRepository;
    private final PickupMapper pickupMapper;

    @Override
    public Page<PickupResponse> getPickups(PickupStatus status, LocalDate date, String city,
                                            Integer collectorId, Pageable pageable) {
        Page<Pickup> pickups;

        if (status != null && date != null) {
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = start.plusDays(1);
            pickups = pickupRepository.findByStatusAndCreatedAtRange(status, start, end, pageable);
        } else if (status != null) {
            pickups = pickupRepository.findByStatus(status, pageable);
        } else if (date != null) {
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = start.plusDays(1);
            pickups = pickupRepository.findByCreatedAtRange(start, end, pageable);
        } else if (city != null) {
            pickups = pickupRepository.findByCity(city, pageable);
        } else if (collectorId != null) {
            pickups = pickupRepository.findByCollector_Id(collectorId, pageable);
        } else {
            pickups = pickupRepository.findAll(pageable);
        }

        return pickups.map(pickupMapper::toResponse);
    }

    @Override
    public PickupResponse getPickupById(Integer id) {
        Pickup pickup = pickupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", id));
        return pickupMapper.toResponse(pickup);
    }

    @Override
    @Transactional
    public PickupResponse assignCollector(Integer pickupId, PickupAssignRequest request) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", pickupId));

        User collector = userRepository.findById(request.getCollectorId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getCollectorId()));

        if (collector.getProfile() == null || collector.getProfile().getRole() == null || 
            !"COLLECTOR".equals(collector.getProfile().getRole().getName())) {
            throw new BadRequestException("User is not a collector");
        }

        pickup.setCollector(collector);
        if (pickup.getStatus() == PickupStatus.scheduled) {
            pickup.setStatus(PickupStatus.in_progress);
        }

        return pickupMapper.toResponse(pickupRepository.save(pickup));
    }

    @Override
    @Transactional
    public PickupResponse updateStatus(Integer pickupId, PickupStatusRequest request) {
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", pickupId));

        PickupStatus newStatus;
        try {
            newStatus = PickupStatus.valueOf(request.getStatus());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + request.getStatus()
                    + ". Allowed: scheduled, in_progress, completed, cancelled");
        }
        pickup.setStatus(newStatus);

        return pickupMapper.toResponse(pickupRepository.save(pickup));
    }

    @Override
    @Transactional
    public PickupResponse createPickup(PickupRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));
        
        PickupStatus status = PickupStatus.scheduled;
        if (request.getStatus() != null) {
            try {
                status = PickupStatus.valueOf(request.getStatus());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + request.getStatus());
            }
        }

        Pickup pickup = Pickup.builder()
                .user(user)
                .items(request.getItems())
                .timeSlot(request.getTimeSlot())
                .city(request.getCity())
                .totalQty(request.getTotalQty())
                .totalWeight(request.getTotalWeight())
                .amount(request.getAmount())
                .status(status)
                .build();
                
        if (request.getCollectorId() != null) {
            User collector = userRepository.findById(request.getCollectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getCollectorId()));
            pickup.setCollector(collector);
        }
        
        return pickupMapper.toResponse(pickupRepository.save(pickup));
    }

    @Override
    @Transactional
    public PickupResponse updatePickup(Integer id, PickupRequest request) {
        Pickup pickup = pickupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", id));
                
        pickup.setItems(request.getItems());
        pickup.setTimeSlot(request.getTimeSlot());
        pickup.setCity(request.getCity());
        pickup.setTotalQty(request.getTotalQty());
        pickup.setTotalWeight(request.getTotalWeight());
        pickup.setAmount(request.getAmount());
        
        if (request.getStatus() != null) {
            try {
                pickup.setStatus(PickupStatus.valueOf(request.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + request.getStatus());
            }
        }

        if (request.getCollectorId() != null) {
            User collector = userRepository.findById(request.getCollectorId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getCollectorId()));
            pickup.setCollector(collector);
        } else {
            pickup.setCollector(null);
        }
        
        return pickupMapper.toResponse(pickupRepository.save(pickup));
    }

    @Override
    @Transactional
    public void deletePickup(Integer id) {
        Pickup pickup = pickupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", id));
        pickupRepository.delete(pickup);
    }
}
