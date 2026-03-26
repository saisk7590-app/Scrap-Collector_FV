package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.request.ScrapRequestUpdateRequest;
import com.scrapmgmt.dto.response.ScrapRequestResponse;
import com.scrapmgmt.entity.ScrapRequest;
import com.scrapmgmt.entity.enums.ScrapRequestStatus;
import com.scrapmgmt.exception.BadRequestException;
import com.scrapmgmt.exception.ResourceNotFoundException;
import com.scrapmgmt.mapper.ScrapRequestMapper;
import com.scrapmgmt.repository.ScrapRequestRepository;
import com.scrapmgmt.service.ScrapRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScrapRequestServiceImpl implements ScrapRequestService {

    private final ScrapRequestRepository requestRepository;
    private final ScrapRequestMapper requestMapper;

    @Override
    public Page<ScrapRequestResponse> getRequests(ScrapRequestStatus status, Pageable pageable) {
        Page<ScrapRequest> requests;
        if (status != null) {
            requests = requestRepository.findByStatus(status, pageable);
        } else {
            requests = requestRepository.findAll(pageable);
        }
        return requests.map(requestMapper::toResponse);
    }

    @Override
    public ScrapRequestResponse getRequestById(Integer id) {
        ScrapRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScrapRequest", "id", id));
        return requestMapper.toResponse(request);
    }

    @Override
    @Transactional
    public ScrapRequestResponse approveRequest(Integer id, ScrapRequestUpdateRequest updateRequest) {
        ScrapRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScrapRequest", "id", id));

        if (request.getStatus() != ScrapRequestStatus.submitted) {
            throw new BadRequestException("Only SUBMITTED requests can be approved. Current status: " + request.getStatus());
        }

        request.setStatus(ScrapRequestStatus.approved);

        return requestMapper.toResponse(requestRepository.save(request));
    }

    @Override
    @Transactional
    public ScrapRequestResponse rejectRequest(Integer id, ScrapRequestUpdateRequest updateRequest) {
        ScrapRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScrapRequest", "id", id));

        if (request.getStatus() != ScrapRequestStatus.submitted) {
            throw new BadRequestException("Only SUBMITTED requests can be rejected. Current status: " + request.getStatus());
        }

        request.setStatus(ScrapRequestStatus.rejected);

        return requestMapper.toResponse(requestRepository.save(request));
    }
}
