package com.scrapmgmt.repository;

import com.scrapmgmt.entity.Pickup;
import com.scrapmgmt.entity.enums.PickupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Integer> {

    Page<Pickup> findByStatus(PickupStatus status, Pageable pageable);

    Page<Pickup> findByCollector_Id(Integer collectorId, Pageable pageable);

    Page<Pickup> findByUser_Id(Integer userId, Pageable pageable);

    Page<Pickup> findByCity(String city, Pageable pageable);

    @Query("SELECT p FROM Pickup p WHERE p.createdAt >= :start AND p.createdAt < :end")
    Page<Pickup> findByCreatedAtRange(@Param("start") LocalDateTime start,
                                      @Param("end") LocalDateTime end,
                                      Pageable pageable);

    @Query("SELECT p FROM Pickup p WHERE p.status = :status AND p.createdAt >= :start AND p.createdAt < :end")
    Page<Pickup> findByStatusAndCreatedAtRange(@Param("status") PickupStatus status,
                                               @Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end,
                                               Pageable pageable);

    @Query("SELECT COUNT(p) FROM Pickup p WHERE p.createdAt >= :start AND p.createdAt < :end")
    long countCreatedAtRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    long countByStatus(PickupStatus status);

    @Query("SELECT COUNT(p) FROM Pickup p WHERE p.status = :status AND p.createdAt >= :start AND p.createdAt < :end")
    long countByStatusAndCreatedAtRange(@Param("status") PickupStatus status,
                                        @Param("start") LocalDateTime start,
                                        @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Pickup p WHERE p.status = 'completed' AND p.createdAt >= :start AND p.createdAt < :end")
    BigDecimal sumRevenueByCreatedAtRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Pickup p WHERE p.status = 'completed'")
    BigDecimal sumTotalRevenue();

    @Query(value = "SELECT CAST(p.created_at as date) AS d, COUNT(*) AS c " +
            "FROM pickups p " +
            "WHERE p.created_at >= CAST(:startDate AS date) " +
            "AND p.created_at < (CAST(:endDate AS date) + integer '1') " +
            "GROUP BY d ORDER BY d", nativeQuery = true)
    List<Object[]> countPickupsGroupedByDate(@Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate);
}
