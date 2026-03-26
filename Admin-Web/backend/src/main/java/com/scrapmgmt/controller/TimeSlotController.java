package com.scrapmgmt.controller;

import com.scrapmgmt.dto.request.TimeSlotRequest;
import com.scrapmgmt.dto.response.ApiResponse;
import com.scrapmgmt.dto.response.TimeSlotResponse;
import com.scrapmgmt.service.TimeSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/time-slots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> getAllTimeSlots() {
        return ResponseEntity.ok(ApiResponse.ok(timeSlotService.getAllTimeSlots()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> getActiveTimeSlots() {
        return ResponseEntity.ok(ApiResponse.ok(timeSlotService.getActiveTimeSlots()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TimeSlotResponse>> createTimeSlot(@Valid @RequestBody TimeSlotRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Time slot created", timeSlotService.createTimeSlot(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TimeSlotResponse>> updateTimeSlot(
            @PathVariable("id") Integer id, @Valid @RequestBody TimeSlotRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Time slot updated", timeSlotService.updateTimeSlot(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTimeSlot(@PathVariable("id") Integer id) {
        timeSlotService.deleteTimeSlot(id);
        return ResponseEntity.ok(ApiResponse.success("Time slot deleted"));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<TimeSlotResponse>> toggleActive(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Time slot toggled", timeSlotService.toggleActive(id)));
    }
}
