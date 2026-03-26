package com.scrapmgmt.controller;

import com.scrapmgmt.dto.request.ScrapRequestUpdateRequest;
import com.scrapmgmt.dto.response.ApiResponse;
import com.scrapmgmt.dto.response.PagedResponse;
import com.scrapmgmt.dto.response.ScrapRequestResponse;
import com.scrapmgmt.entity.enums.ScrapRequestStatus;
import com.scrapmgmt.service.ScrapRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/scrap-requests")
@RequiredArgsConstructor
public class ScrapRequestController {

    private final ScrapRequestService requestService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ScrapRequestResponse>>> getRequests(
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        ScrapRequestStatus reqStatus = status != null ? ScrapRequestStatus.valueOf(status.toUpperCase()) : null;
        return ResponseEntity.ok(ApiResponse.ok(PagedResponse.of(requestService.getRequests(reqStatus, pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScrapRequestResponse>> getRequestById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(requestService.getRequestById(id)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ScrapRequestResponse>> approveRequest(
            @PathVariable("id") Integer id, @RequestBody(required = false) ScrapRequestUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Request approved", requestService.approveRequest(id, request)));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ScrapRequestResponse>> rejectRequest(
            @PathVariable("id") Integer id, @RequestBody(required = false) ScrapRequestUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Request rejected", requestService.rejectRequest(id, request)));
    }
}
