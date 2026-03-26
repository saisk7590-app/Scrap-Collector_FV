package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.request.AddressRequest;
import com.scrapmgmt.dto.response.AddressResponse;
import com.scrapmgmt.entity.User;
import com.scrapmgmt.entity.UserAddress;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-26T11:05:35+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class AddressMapperImpl implements AddressMapper {

    @Override
    public AddressResponse toResponse(UserAddress address) {
        if ( address == null ) {
            return null;
        }

        AddressResponse addressResponse = new AddressResponse();

        addressResponse.setUserId( addressUserId( address ) );
        addressResponse.setId( address.getId() );
        addressResponse.setType( address.getType() );
        addressResponse.setAddress( address.getAddress() );
        addressResponse.setHouseNo( address.getHouseNo() );
        addressResponse.setArea( address.getArea() );
        addressResponse.setPincode( address.getPincode() );
        addressResponse.setLandmark( address.getLandmark() );
        addressResponse.setIsDefault( address.getIsDefault() );

        return addressResponse;
    }

    @Override
    public UserAddress toEntity(AddressRequest request) {
        if ( request == null ) {
            return null;
        }

        UserAddress userAddress = new UserAddress();

        userAddress.setType( request.getType() );
        userAddress.setHouseNo( request.getHouseNo() );
        userAddress.setArea( request.getArea() );
        userAddress.setPincode( request.getPincode() );
        userAddress.setLandmark( request.getLandmark() );
        userAddress.setAddress( request.getAddress() );
        userAddress.setIsDefault( request.getIsDefault() );

        return userAddress;
    }

    @Override
    public void updateEntity(AddressRequest request, UserAddress address) {
        if ( request == null ) {
            return;
        }

        address.setType( request.getType() );
        address.setHouseNo( request.getHouseNo() );
        address.setArea( request.getArea() );
        address.setPincode( request.getPincode() );
        address.setLandmark( request.getLandmark() );
        address.setAddress( request.getAddress() );
        address.setIsDefault( request.getIsDefault() );
    }

    private Integer addressUserId(UserAddress userAddress) {
        if ( userAddress == null ) {
            return null;
        }
        User user = userAddress.getUser();
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
