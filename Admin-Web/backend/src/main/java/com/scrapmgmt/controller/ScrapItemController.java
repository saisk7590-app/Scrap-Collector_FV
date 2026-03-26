package com.scrapmgmt.controller;

import com.scrapmgmt.dto.request.ScrapItemRequest;
import com.scrapmgmt.dto.response.ApiResponse;
import com.scrapmgmt.dto.response.PagedResponse;
import com.scrapmgmt.dto.response.ScrapItemResponse;
import com.scrapmgmt.service.ScrapItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/scrap-items")
@RequiredArgsConstructor
public class ScrapItemController {

    private final ScrapItemService itemService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ScrapItemResponse>>> getItems(
            @RequestParam(name = "categoryId", required = false) Integer categoryId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "desc") String sortDir) {

        log.info("[GET /api/admin/scrap-items] categoryId={}, page={}, size={}", categoryId, page, size);
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PagedResponse<ScrapItemResponse> result = PagedResponse.of(itemService.getItems(categoryId, pageable));
        log.info("[GET /api/admin/scrap-items] Returning {} items", result.getContent().size());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScrapItemResponse>> getItemById(@PathVariable("id") Integer id) {
        log.info("[GET /api/admin/scrap-items/{}] Fetching item", id);
        return ResponseEntity.ok(ApiResponse.ok(itemService.getItemById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ScrapItemResponse>> createItem(@Valid @RequestBody ScrapItemRequest request) {
        log.info("[POST /api/admin/scrap-items] Request body: categoryId={}, name={}, measurementType={}, basePrice={}",
                request.getCategoryId(), request.getName(), request.getMeasurementType(), request.getBasePrice());
        ScrapItemResponse created = itemService.createItem(request);
        log.info("[POST /api/admin/scrap-items] Created item: id={}, name={}", created.getId(), created.getName());
        return ResponseEntity.ok(ApiResponse.ok("Item created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ScrapItemResponse>> updateItem(
            @PathVariable("id") Integer id, @Valid @RequestBody ScrapItemRequest request) {
        log.info("[PUT /api/admin/scrap-items/{}] Request body: {}", id, request);
        return ResponseEntity.ok(ApiResponse.ok("Item updated", itemService.updateItem(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable("id") Integer id) {
        log.info("[DELETE /api/admin/scrap-items/{}] Deleting item", id);
        itemService.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success("Item deleted"));
    }
}
