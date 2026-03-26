package com.scrapmgmt.controller;

import com.scrapmgmt.dto.request.ScrapCategoryRequest;
import com.scrapmgmt.dto.response.ApiResponse;
import com.scrapmgmt.dto.response.ScrapCategoryResponse;
import com.scrapmgmt.service.ScrapCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class ScrapCategoryController {

    private final ScrapCategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScrapCategoryResponse>>> getAllCategories() {
        log.info("[GET /api/categories] Fetching all categories");
        List<ScrapCategoryResponse> categories = categoryService.getAllCategories();
        log.info("[GET /api/categories] Returning {} categories", categories.size());
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScrapCategoryResponse>> getCategoryById(@PathVariable("id") Integer id) {
        log.info("[GET /api/categories/{}] Fetching category", id);
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getCategoryById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ScrapCategoryResponse>> createCategory(
            @Valid @RequestBody ScrapCategoryRequest request) {
        log.info("[POST /api/categories] Request body: {}", request);
        ScrapCategoryResponse created = categoryService.createCategory(request);
        log.info("[POST /api/categories] Created category: id={}, name={}", created.getId(), created.getName());
        return ResponseEntity.ok(ApiResponse.ok("Category created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ScrapCategoryResponse>> updateCategory(
            @PathVariable("id") Integer id, @Valid @RequestBody ScrapCategoryRequest request) {
        log.info("[PUT /api/categories/{}] Request body: {}", id, request);
        return ResponseEntity.ok(ApiResponse.ok("Category updated", categoryService.updateCategory(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable("id") Integer id) {
        log.info("[DELETE /api/categories/{}] Deleting category", id);
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted"));
    }
}
