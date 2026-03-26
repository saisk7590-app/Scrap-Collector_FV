package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.request.TimeSlotRequest;
import com.scrapmgmt.dto.response.TimeSlotResponse;
import com.scrapmgmt.entity.TimeSlot;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-26T11:05:35+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class TimeSlotMapperImpl implements TimeSlotMapper {

    @Override
    public TimeSlotResponse toResponse(TimeSlot timeSlot) {
        if ( timeSlot == null ) {
            return null;
        }

        TimeSlotResponse timeSlotResponse = new TimeSlotResponse();

        timeSlotResponse.setId( timeSlot.getId() );
        timeSlotResponse.setSlotText( timeSlot.getSlotText() );
        timeSlotResponse.setIsActive( timeSlot.getIsActive() );

        return timeSlotResponse;
    }

    @Override
    public TimeSlot toEntity(TimeSlotRequest request) {
        if ( request == null ) {
            return null;
        }

        TimeSlot timeSlot = new TimeSlot();

        timeSlot.setSlotText( request.getSlotText() );
        timeSlot.setIsActive( request.getIsActive() );

        return timeSlot;
    }

    @Override
    public void updateEntity(TimeSlotRequest request, TimeSlot timeSlot) {
        if ( request == null ) {
            return;
        }

        timeSlot.setSlotText( request.getSlotText() );
        timeSlot.setIsActive( request.getIsActive() );
    }
}
