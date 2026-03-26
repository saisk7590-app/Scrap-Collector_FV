package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.response.PickupResponse;
import com.scrapmgmt.entity.Pickup;
import com.scrapmgmt.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-26T11:05:34+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class PickupMapperImpl implements PickupMapper {

    @Override
    public PickupResponse toResponse(Pickup pickup) {
        if ( pickup == null ) {
            return null;
        }

        PickupResponse pickupResponse = new PickupResponse();

        pickupResponse.setCustomerId( pickupUserId( pickup ) );
        pickupResponse.setTimeSlotLabel( pickup.getTimeSlot() );
        pickupResponse.setId( pickup.getId() );
        pickupResponse.setCity( pickup.getCity() );
        pickupResponse.setTotalQty( pickup.getTotalQty() );
        pickupResponse.setTotalWeight( pickup.getTotalWeight() );
        pickupResponse.setAmount( pickup.getAmount() );
        pickupResponse.setCreatedAt( pickup.getCreatedAt() );
        pickupResponse.setUpdatedAt( pickup.getUpdatedAt() );

        pickupResponse.setScrapRequestId( null );
        pickupResponse.setCustomerName( pickup.getUser() != null && pickup.getUser().getProfile() != null ? pickup.getUser().getProfile().getFullName() : null );
        pickupResponse.setCustomerPhone( pickup.getUser() != null && pickup.getUser().getProfile() != null ? pickup.getUser().getProfile().getPhone() : null );
        pickupResponse.setCollectorId( pickup.getCollector() != null ? pickup.getCollector().getId() : null );
        pickupResponse.setCollectorName( pickup.getCollector() != null && pickup.getCollector().getProfile() != null ? pickup.getCollector().getProfile().getFullName() : null );
        pickupResponse.setCollectorPhone( pickup.getCollector() != null && pickup.getCollector().getProfile() != null ? pickup.getCollector().getProfile().getPhone() : null );
        pickupResponse.setAddressLine( null );
        pickupResponse.setStatus( pickup.getStatus().name() );
        pickupResponse.setNotes( null );
        pickupResponse.setScheduledDate( pickup.getCreatedAt() != null ? pickup.getCreatedAt().toLocalDate() : null );

        return pickupResponse;
    }

    private Integer pickupUserId(Pickup pickup) {
        if ( pickup == null ) {
            return null;
        }
        User user = pickup.getUser();
        if ( user == null ) {
            return null;
        }
        Integer id = user.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
