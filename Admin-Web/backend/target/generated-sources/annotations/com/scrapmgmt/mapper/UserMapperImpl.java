package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.response.UserResponse;
import com.scrapmgmt.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-26T11:05:34+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse userResponse = new UserResponse();

        userResponse.setId( user.getId() );
        userResponse.setEmail( user.getEmail() );
        userResponse.setCreatedAt( user.getCreatedAt() );

        userResponse.setName( user.getProfile() != null ? user.getProfile().getFullName() : null );
        userResponse.setPhone( user.getProfile() != null ? user.getProfile().getPhone() : null );
        userResponse.setRole( user.getProfile() != null && user.getProfile().getRole() != null ? user.getProfile().getRole().getName() : null );
        userResponse.setWalletBalance( user.getProfile() != null ? user.getProfile().getWalletBalance() : null );
        userResponse.setIsActive( true );
        userResponse.setCity( null );
        userResponse.setState( null );
        userResponse.setAvatarUrl( null );

        return userResponse;
    }
}
