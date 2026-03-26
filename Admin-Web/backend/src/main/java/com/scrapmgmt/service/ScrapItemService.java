package com.scrapmgmt.service;

import com.scrapmgmt.dto.request.ScrapItemRequest;
import com.scrapmgmt.dto.response.ScrapItemResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ScrapItemService {

    Page<ScrapItemResponse> getItems(Integer categoryId, Pageable pageable);

    ScrapItemResponse getItemById(Integer id);

    ScrapItemResponse createItem(ScrapItemRequest request);

    ScrapItemResponse updateItem(Integer id, ScrapItemRequest request);

    void deleteItem(Integer id);
}
