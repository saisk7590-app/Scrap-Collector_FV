package com.scrapmgmt.repository;

import com.scrapmgmt.entity.ScrapCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScrapCategoryRepository extends JpaRepository<ScrapCategory, Integer> {

    boolean existsByName(String name);
}
