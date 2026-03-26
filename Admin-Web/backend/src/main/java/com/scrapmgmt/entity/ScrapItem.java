package com.scrapmgmt.entity;

import com.scrapmgmt.entity.enums.MeasurementType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "scrap_items", indexes = {
        @Index(name = "idx_scrap_items_category_id", columnList = "category_id")
}, uniqueConstraints = {
        @UniqueConstraint(columnNames = {"category_id", "name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScrapItem extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private ScrapCategory category;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "measurement_type", nullable = false, length = 20)
    private MeasurementType measurementType;

    @Column(name = "base_price", precision = 10, scale = 2)
    private BigDecimal basePrice;
}
