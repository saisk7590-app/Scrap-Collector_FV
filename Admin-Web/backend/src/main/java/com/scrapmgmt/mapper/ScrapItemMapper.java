package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.response.ScrapItemResponse;
import com.scrapmgmt.entity.ScrapItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface ScrapItemMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "measurementType", expression = "java(item.getMeasurementType().name())")
    ScrapItemResponse toResponse(ScrapItem item);
}
