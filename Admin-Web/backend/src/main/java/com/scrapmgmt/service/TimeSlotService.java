package com.scrapmgmt.service;

import com.scrapmgmt.dto.request.TimeSlotRequest;
import com.scrapmgmt.dto.response.TimeSlotResponse;

import java.util.List;

public interface TimeSlotService {

    List<TimeSlotResponse> getAllTimeSlots();

    List<TimeSlotResponse> getActiveTimeSlots();

    TimeSlotResponse createTimeSlot(TimeSlotRequest request);

    TimeSlotResponse updateTimeSlot(Integer id, TimeSlotRequest request);

    void deleteTimeSlot(Integer id);

    TimeSlotResponse toggleActive(Integer id);
}
