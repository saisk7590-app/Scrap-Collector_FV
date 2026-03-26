package com.scrapmgmt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "time_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlot extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "slot_text", nullable = false, unique = true)
    private String slotText;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
