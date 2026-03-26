package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.response.ScrapRequestResponse;
import com.scrapmgmt.entity.ScrapRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface ScrapRequestMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", expression = "java(request.getUser() != null && request.getUser().getProfile() != null ? request.getUser().getProfile().getFullName() : null)")
    @Mapping(target = "status", expression = "java(request.getStatus().name())")
    @Mapping(target = "estimatedWeight", source = "totalWeight")
    @Mapping(target = "adminNotes", expression = "java(null)")
    ScrapRequestResponse toResponse(ScrapRequest request);
}
