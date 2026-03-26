package com.scrapmgmt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scrap_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScrapCategory extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;


    @Builder.Default
    @Column(name = "icon_name", length = 50)
    private String iconName = "default_icon";


    @Builder.Default
    @Column(name = "icon_bg", length = 20)
    private String iconBg = "#E5E7EB";


    @Builder.Default
    @Column(name = "card_bg", length = 20)
    private String cardBg = "#FFFFFF";
}
