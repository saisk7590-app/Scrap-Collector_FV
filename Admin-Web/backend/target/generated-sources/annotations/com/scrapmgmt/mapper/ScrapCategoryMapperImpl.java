package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.request.ScrapCategoryRequest;
import com.scrapmgmt.dto.response.ScrapCategoryResponse;
import com.scrapmgmt.entity.ScrapCategory;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-26T11:05:35+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class ScrapCategoryMapperImpl implements ScrapCategoryMapper {

    @Override
    public ScrapCategoryResponse toResponse(ScrapCategory category) {
        if ( category == null ) {
            return null;
        }

        ScrapCategoryResponse scrapCategoryResponse = new ScrapCategoryResponse();

        scrapCategoryResponse.setId( category.getId() );
        scrapCategoryResponse.setName( category.getName() );
        scrapCategoryResponse.setIconName( category.getIconName() );
        scrapCategoryResponse.setIconBg( category.getIconBg() );
        scrapCategoryResponse.setCardBg( category.getCardBg() );
        scrapCategoryResponse.setCreatedAt( category.getCreatedAt() );

        return scrapCategoryResponse;
    }

    @Override
    public ScrapCategory toEntity(ScrapCategoryRequest request) {
        if ( request == null ) {
            return null;
        }

        ScrapCategory scrapCategory = new ScrapCategory();

        scrapCategory.setName( request.getName() );
        scrapCategory.setIconName( request.getIconName() );
        scrapCategory.setIconBg( request.getIconBg() );
        scrapCategory.setCardBg( request.getCardBg() );

        return scrapCategory;
    }

    @Override
    public void updateEntity(ScrapCategoryRequest request, ScrapCategory category) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            category.setName( request.getName() );
        }
        if ( request.getIconName() != null ) {
            category.setIconName( request.getIconName() );
        }
        if ( request.getIconBg() != null ) {
            category.setIconBg( request.getIconBg() );
        }
        if ( request.getCardBg() != null ) {
            category.setCardBg( request.getCardBg() );
        }
    }
}
