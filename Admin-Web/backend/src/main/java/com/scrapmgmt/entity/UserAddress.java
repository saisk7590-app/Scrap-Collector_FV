package com.scrapmgmt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_addresses", indexes = {
        @Index(name = "idx_user_addresses_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 20)
    @Builder.Default
    private String type = "Home";

    @Column(name = "house_no", length = 100)
    private String houseNo;

    @Column(length = 100)
    private String area;

    @Column(length = 10)
    private String pincode;

    @Column(columnDefinition = "TEXT")
    private String landmark;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;
}
