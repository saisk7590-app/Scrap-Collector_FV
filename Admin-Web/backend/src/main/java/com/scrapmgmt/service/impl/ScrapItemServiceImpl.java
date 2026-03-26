package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.request.ScrapItemRequest;
import com.scrapmgmt.dto.response.ScrapItemResponse;
import com.scrapmgmt.entity.ScrapCategory;
import com.scrapmgmt.entity.ScrapItem;
import com.scrapmgmt.entity.enums.MeasurementType;
import com.scrapmgmt.exception.ResourceNotFoundException;
import com.scrapmgmt.mapper.ScrapItemMapper;
import com.scrapmgmt.repository.ScrapCategoryRepository;
import com.scrapmgmt.repository.ScrapItemRepository;
import com.scrapmgmt.service.ScrapItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ScrapItemServiceImpl implements ScrapItemService {

    private final ScrapItemRepository itemRepository;
    private final ScrapCategoryRepository categoryRepository;
    private final ScrapItemMapper itemMapper;

    @Override
    public Page<ScrapItemResponse> getItems(Integer categoryId, Pageable pageable) {
        Page<ScrapItem> items;
        if (categoryId != null) {
            items = itemRepository.findByCategory_Id(categoryId, pageable);
        } else {
            items = itemRepository.findAll(pageable);
        }
        return items.map(itemMapper::toResponse);
    }

    @Override
    public ScrapItemResponse getItemById(Integer id) {
        ScrapItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScrapItem", "id", id));
        return itemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public ScrapItemResponse createItem(ScrapItemRequest request) {
        ScrapCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("ScrapCategory", "id", request.getCategoryId()));

        ScrapItem item = ScrapItem.builder()
                .category(category)
                .name(request.getName())
                .basePrice(request.getBasePrice())
                .measurementType(MeasurementType.valueOf(request.getMeasurementType().toLowerCase()))
                .build();

        return itemMapper.toResponse(itemRepository.save(item));
    }

    @Override
    @Transactional
    public ScrapItemResponse updateItem(Integer id, ScrapItemRequest request) {
        ScrapItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ScrapItem", "id", id));

        if (request.getCategoryId() != null) {
            ScrapCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("ScrapCategory", "id", request.getCategoryId()));
            item.setCategory(category);
        }

        if (request.getName() != null) item.setName(request.getName());
        if (request.getBasePrice() != null) item.setBasePrice(request.getBasePrice());
        if (request.getMeasurementType() != null)
            item.setMeasurementType(MeasurementType.valueOf(request.getMeasurementType().toLowerCase()));

        return itemMapper.toResponse(itemRepository.save(item));
    }

    @Override
    @Transactional
    public void deleteItem(Integer id) {
        if (!itemRepository.existsById(id)) {
            throw new ResourceNotFoundException("ScrapItem", "id", id);
        }
        itemRepository.deleteById(id);
    }
}
