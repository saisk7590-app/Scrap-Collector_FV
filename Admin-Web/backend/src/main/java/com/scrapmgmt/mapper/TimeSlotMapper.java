package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.request.TimeSlotRequest;
import com.scrapmgmt.dto.response.TimeSlotResponse;
import com.scrapmgmt.entity.TimeSlot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface TimeSlotMapper {

    TimeSlotResponse toResponse(TimeSlot timeSlot);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    TimeSlot toEntity(TimeSlotRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(TimeSlotRequest request, @MappingTarget TimeSlot timeSlot);
}
