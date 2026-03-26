package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.request.TimeSlotRequest;
import com.scrapmgmt.dto.response.TimeSlotResponse;
import com.scrapmgmt.entity.TimeSlot;
import com.scrapmgmt.exception.ResourceNotFoundException;
import com.scrapmgmt.mapper.TimeSlotMapper;
import com.scrapmgmt.repository.TimeSlotRepository;
import com.scrapmgmt.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;

    @Override
    public List<TimeSlotResponse> getAllTimeSlots() {
        return timeSlotRepository.findAll().stream()
                .map(timeSlotMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimeSlotResponse> getActiveTimeSlots() {
        return timeSlotRepository.findByIsActiveTrue().stream()
                .map(timeSlotMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TimeSlotResponse createTimeSlot(TimeSlotRequest request) {
        TimeSlot slot = timeSlotMapper.toEntity(request);
        return timeSlotMapper.toResponse(timeSlotRepository.save(slot));
    }

    @Override
    @Transactional
    public TimeSlotResponse updateTimeSlot(Integer id, TimeSlotRequest request) {
        TimeSlot slot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", id));
        timeSlotMapper.updateEntity(request, slot);
        return timeSlotMapper.toResponse(timeSlotRepository.save(slot));
    }

    @Override
    @Transactional
    public void deleteTimeSlot(Integer id) {
        if (!timeSlotRepository.existsById(id)) {
            throw new ResourceNotFoundException("TimeSlot", "id", id);
        }
        timeSlotRepository.deleteById(id);
    }

    @Override
    @Transactional
    public TimeSlotResponse toggleActive(Integer id) {
        TimeSlot slot = timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot", "id", id));
        slot.setIsActive(!slot.getIsActive());
        return timeSlotMapper.toResponse(timeSlotRepository.save(slot));
    }
}
