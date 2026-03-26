package com.scrapmgmt.service;

import com.scrapmgmt.dto.request.ScrapCategoryRequest;
import com.scrapmgmt.dto.response.ScrapCategoryResponse;

import java.util.List;

public interface ScrapCategoryService {

    List<ScrapCategoryResponse> getAllCategories();

    ScrapCategoryResponse getCategoryById(Integer id);

    ScrapCategoryResponse createCategory(ScrapCategoryRequest request);

    ScrapCategoryResponse updateCategory(Integer id, ScrapCategoryRequest request);

    void deleteCategory(Integer id);
}
