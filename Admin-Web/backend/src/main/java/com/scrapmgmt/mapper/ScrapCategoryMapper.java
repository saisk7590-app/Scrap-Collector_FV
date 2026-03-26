package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.request.ScrapCategoryRequest;
import com.scrapmgmt.dto.response.ScrapCategoryResponse;
import com.scrapmgmt.entity.ScrapCategory;
import org.mapstruct.*;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface ScrapCategoryMapper {

    ScrapCategoryResponse toResponse(ScrapCategory category);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ScrapCategory toEntity(ScrapCategoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ScrapCategoryRequest request, @MappingTarget ScrapCategory category);
}
