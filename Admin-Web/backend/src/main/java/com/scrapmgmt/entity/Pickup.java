package com.scrapmgmt.entity;

import com.scrapmgmt.entity.enums.PickupStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;

@Entity
@Table(name = "pickups", indexes = {
        @Index(name = "idx_pickups_status", columnList = "status"),
        @Index(name = "idx_pickups_created_at", columnList = "created_at"),
        @Index(name = "idx_pickups_collector_id", columnList = "collector_id"),
        @Index(name = "idx_pickups_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pickup extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id")
    private User collector;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String items;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PickupStatus status = PickupStatus.scheduled;

    @Column(name = "total_qty")
    @Builder.Default
    private Integer totalQty = 0;

    @Column(name = "total_weight", precision = 10, scale = 2)
    private BigDecimal totalWeight;

    @Column(name = "alternate_number", length = 20)
    private String alternateNumber;

    @Column(name = "time_slot", length = 50)
    private String timeSlot;

    @Column(length = 100)
    @Builder.Default
    private String city = "Hyderabad";

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "pickup_no", insertable = false, updatable = false)
    private Integer pickupNo;
}
