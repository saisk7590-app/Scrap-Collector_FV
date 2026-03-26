package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.request.AddressRequest;
import com.scrapmgmt.dto.response.AddressResponse;
import com.scrapmgmt.entity.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface AddressMapper {

    @Mapping(target = "userId", source = "user.id")
    AddressResponse toResponse(UserAddress address);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    UserAddress toEntity(AddressRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(AddressRequest request, @MappingTarget UserAddress address);
}
