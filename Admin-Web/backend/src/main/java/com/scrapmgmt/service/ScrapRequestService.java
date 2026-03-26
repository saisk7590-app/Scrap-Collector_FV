package com.scrapmgmt.service;

import com.scrapmgmt.dto.request.ScrapRequestUpdateRequest;
import com.scrapmgmt.dto.response.ScrapRequestResponse;
import com.scrapmgmt.entity.enums.ScrapRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ScrapRequestService {

    Page<ScrapRequestResponse> getRequests(ScrapRequestStatus status, Pageable pageable);

    ScrapRequestResponse getRequestById(Integer id);

    ScrapRequestResponse approveRequest(Integer id, ScrapRequestUpdateRequest request);

    ScrapRequestResponse rejectRequest(Integer id, ScrapRequestUpdateRequest request);
}
