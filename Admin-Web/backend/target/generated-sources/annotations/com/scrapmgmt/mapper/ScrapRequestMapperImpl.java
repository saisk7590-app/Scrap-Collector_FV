package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.response.ScrapRequestResponse;
import com.scrapmgmt.entity.ScrapRequest;
import com.scrapmgmt.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-26T11:05:34+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class ScrapRequestMapperImpl implements ScrapRequestMapper {

    @Override
    public ScrapRequestResponse toResponse(ScrapRequest request) {
        if ( request == null ) {
            return null;
        }

        ScrapRequestResponse scrapRequestResponse = new ScrapRequestResponse();

        scrapRequestResponse.setUserId( requestUserId( request ) );
        scrapRequestResponse.setEstimatedWeight( request.getTotalWeight() );
        scrapRequestResponse.setId( request.getId() );
        scrapRequestResponse.setItems( request.getItems() );
        scrapRequestResponse.setCreatedAt( request.getCreatedAt() );
        scrapRequestResponse.setUpdatedAt( request.getUpdatedAt() );

        scrapRequestResponse.setUserName( request.getUser() != null && request.getUser().getProfile() != null ? request.getUser().getProfile().getFullName() : null );
        scrapRequestResponse.setStatus( request.getStatus().name() );
        scrapRequestResponse.setAdminNotes( null );

        return scrapRequestResponse;
    }

    private Integer requestUserId(ScrapRequest scrapRequest) {
        if ( scrapRequest == null ) {
            return null;
        }
        User user = scrapRequest.getUser();
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
