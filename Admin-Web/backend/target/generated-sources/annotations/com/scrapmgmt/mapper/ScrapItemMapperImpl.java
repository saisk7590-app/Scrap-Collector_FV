package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.response.ScrapItemResponse;
import com.scrapmgmt.entity.ScrapCategory;
import com.scrapmgmt.entity.ScrapItem;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-26T11:05:34+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class ScrapItemMapperImpl implements ScrapItemMapper {

    @Override
    public ScrapItemResponse toResponse(ScrapItem item) {
        if ( item == null ) {
            return null;
        }

        ScrapItemResponse scrapItemResponse = new ScrapItemResponse();

        scrapItemResponse.setCategoryId( itemCategoryId( item ) );
        scrapItemResponse.setCategoryName( itemCategoryName( item ) );
        scrapItemResponse.setId( item.getId() );
        scrapItemResponse.setName( item.getName() );
        scrapItemResponse.setBasePrice( item.getBasePrice() );
        scrapItemResponse.setCreatedAt( item.getCreatedAt() );

        scrapItemResponse.setMeasurementType( item.getMeasurementType().name() );

        return scrapItemResponse;
    }

    private Integer itemCategoryId(ScrapItem scrapItem) {
        if ( scrapItem == null ) {
            return null;
        }
        ScrapCategory category = scrapItem.getCategory();
        if ( category == null ) {
            return null;
        }
        Integer id = category.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String itemCategoryName(ScrapItem scrapItem) {
        if ( scrapItem == null ) {
            return null;
        }
        ScrapCategory category = scrapItem.getCategory();
        if ( category == null ) {
            return null;
        }
        String name = category.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
