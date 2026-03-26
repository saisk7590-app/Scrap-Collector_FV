package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.request.ScrapCategoryRequest;
import com.scrapmgmt.dto.response.ScrapCategoryResponse;
import com.scrapmgmt.entity.ScrapCategory;
import com.scrapmgmt.exception.BadRequestException;
import com.scrapmgmt.exception.ResourceNotFoundException;
import com.scrapmgmt.mapper.ScrapCategoryMapper;
import com.scrapmgmt.repository.ScrapCategoryRepository;
import com.scrapmgmt.service.ScrapCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScrapCategoryServiceImpl implements ScrapCategoryService {

    private final ScrapCategoryRepository categoryRepository;
    private final ScrapCategoryMapper categoryMapper;

    @Override
    public List<ScrapCategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ScrapCategoryResponse getCategoryById(Integer id) {
        ScrapCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScrapCategory", "id", id));
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public ScrapCategoryResponse createCategory(ScrapCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BadRequestException("Category already exists: " + request.getName());
        }
        ScrapCategory category = categoryMapper.toEntity(request);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public ScrapCategoryResponse updateCategory(Integer id, ScrapCategoryRequest request) {
        ScrapCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScrapCategory", "id", id));
        categoryMapper.updateEntity(request, category);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("ScrapCategory", "id", id);
        }
        categoryRepository.deleteById(id);
    }
}
