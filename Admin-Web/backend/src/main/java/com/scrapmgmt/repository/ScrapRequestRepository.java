package com.scrapmgmt.repository;

import com.scrapmgmt.entity.ScrapRequest;
import com.scrapmgmt.entity.enums.ScrapRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScrapRequestRepository extends JpaRepository<ScrapRequest, Integer> {

    Page<ScrapRequest> findByStatus(ScrapRequestStatus status, Pageable pageable);

    Page<ScrapRequest> findByUser_Id(Integer userId, Pageable pageable);

    long countByStatus(ScrapRequestStatus status);
}
