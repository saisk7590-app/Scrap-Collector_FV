package com.scrapmgmt.repository;

import com.scrapmgmt.entity.ScrapItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScrapItemRepository extends JpaRepository<ScrapItem, Integer> {

    Page<ScrapItem> findByCategory_Id(Integer categoryId, Pageable pageable);
}
