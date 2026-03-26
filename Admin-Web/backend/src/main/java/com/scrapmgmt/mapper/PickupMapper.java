package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.response.PickupResponse;
import com.scrapmgmt.entity.Pickup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface PickupMapper {

    @Mapping(target = "scrapRequestId", expression = "java(null)")
    @Mapping(target = "customerId", source = "user.id")
    @Mapping(target = "customerName", expression = "java(pickup.getUser() != null && pickup.getUser().getProfile() != null ? pickup.getUser().getProfile().getFullName() : null)")
    @Mapping(target = "customerPhone", expression = "java(pickup.getUser() != null && pickup.getUser().getProfile() != null ? pickup.getUser().getProfile().getPhone() : null)")
    @Mapping(target = "collectorId", expression = "java(pickup.getCollector() != null ? pickup.getCollector().getId() : null)")
    @Mapping(target = "collectorName", expression = "java(pickup.getCollector() != null && pickup.getCollector().getProfile() != null ? pickup.getCollector().getProfile().getFullName() : null)")
    @Mapping(target = "collectorPhone", expression = "java(pickup.getCollector() != null && pickup.getCollector().getProfile() != null ? pickup.getCollector().getProfile().getPhone() : null)")
    @Mapping(target = "addressLine", expression = "java(null)")
    @Mapping(target = "status", expression = "java(pickup.getStatus().name())")
    @Mapping(target = "notes", expression = "java(null)")
    @Mapping(target = "timeSlotLabel", source = "timeSlot")
    @Mapping(target = "scheduledDate", expression = "java(pickup.getCreatedAt() != null ? pickup.getCreatedAt().toLocalDate() : null)")
    PickupResponse toResponse(Pickup pickup);
}
