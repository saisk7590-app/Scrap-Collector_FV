package com.scrapmgmt.config;

import com.scrapmgmt.entity.*;
import com.scrapmgmt.entity.enums.*;
import com.scrapmgmt.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ScrapCategoryRepository categoryRepository;
    private final ScrapItemRepository itemRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserAddressRepository addressRepository;
    private final ScrapRequestRepository scrapRequestRepository;
    private final PickupRepository pickupRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("Checking and syncing PostgreSQL sequences...");
        try {
            jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE(max(id)+1, 1), false) FROM roles");
            jdbcTemplate.execute("SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(max(id)+1, 1), false) FROM users");
        } catch (Exception e) {
            log.warn("Sequence sync failed or tables missing: " + e.getMessage());
        }

        // Seed roles if they don't exist
        seedRole("ADMIN", "System Administrator");
        seedRole("USER", "Regular User");
        seedRole("COLLECTOR", "Scrap Collector");

        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        log.info("Seeding database with sample data...");

        User admin = createUser("admin@scrapmgmt.com", "admin123", "Admin User", "9876543210", "ADMIN", BigDecimal.ZERO);
        User collector1 = createUser("imran@scrapmgmt.com", "password", "Imran Khan", "9876543211", "COLLECTOR", BigDecimal.ZERO);
        User collector2 = createUser("suresh@scrapmgmt.com", "password", "Suresh Reddy", "9876543212", "COLLECTOR", BigDecimal.ZERO);
        User customer1 = createUser("ravi@gmail.com", "password", "Ravi Kumar", "8765432100", "USER", new BigDecimal("1500.00"));
        User customer2 = createUser("sneha@gmail.com", "password", "Sneha Reddy", "8765432101", "USER", new BigDecimal("2200.00"));
        User customer3 = createUser("arjun@gmail.com", "password", "Arjun Rao", "8765432102", "USER", new BigDecimal("850.00"));

        ScrapCategory metalCat = categoryRepository.save(ScrapCategory.builder()
                .name("Metal").iconName("metal").iconBg("#e74c3c").cardBg("#fdecea").build());
        ScrapCategory plasticCat = categoryRepository.save(ScrapCategory.builder()
                .name("Plastic").iconName("plastic").iconBg("#3498db").cardBg("#eaf3fb").build());
        ScrapCategory paperCat = categoryRepository.save(ScrapCategory.builder()
                .name("Paper").iconName("paper").iconBg("#2ecc71").cardBg("#eaf8f0").build());
        ScrapCategory ewasteCat = categoryRepository.save(ScrapCategory.builder()
                .name("E-Waste").iconName("ewaste").iconBg("#9b59b6").cardBg("#f3eaf7").build());

        itemRepository.save(ScrapItem.builder().category(metalCat).name("Iron")
                .basePrice(new BigDecimal("28.00")).measurementType(MeasurementType.weight).build());
        itemRepository.save(ScrapItem.builder().category(metalCat).name("Copper")
                .basePrice(new BigDecimal("425.00")).measurementType(MeasurementType.weight).build());
        itemRepository.save(ScrapItem.builder().category(metalCat).name("Aluminium")
                .basePrice(new BigDecimal("105.00")).measurementType(MeasurementType.weight).build());
        itemRepository.save(ScrapItem.builder().category(plasticCat).name("PET Bottles")
                .basePrice(new BigDecimal("12.00")).measurementType(MeasurementType.weight).build());
        itemRepository.save(ScrapItem.builder().category(plasticCat).name("HDPE Containers")
                .basePrice(new BigDecimal("15.00")).measurementType(MeasurementType.weight).build());
        itemRepository.save(ScrapItem.builder().category(paperCat).name("Newspaper")
                .basePrice(new BigDecimal("14.00")).measurementType(MeasurementType.weight).build());
        itemRepository.save(ScrapItem.builder().category(paperCat).name("Cardboard")
                .basePrice(new BigDecimal("8.00")).measurementType(MeasurementType.weight).build());
        itemRepository.save(ScrapItem.builder().category(ewasteCat).name("Mobile Phone")
                .basePrice(new BigDecimal("50.00")).measurementType(MeasurementType.quantity).build());
        itemRepository.save(ScrapItem.builder().category(ewasteCat).name("Laptop")
                .basePrice(new BigDecimal("200.00")).measurementType(MeasurementType.quantity).build());

        timeSlotRepository.save(TimeSlot.builder().slotText("Morning (9-12)").build());
        timeSlotRepository.save(TimeSlot.builder().slotText("Afternoon (12-3)").build());
        timeSlotRepository.save(TimeSlot.builder().slotText("Evening (3-6)").build());

        addressRepository.save(UserAddress.builder()
                .user(customer1).type("Home").address("Flat 401, Green Towers, Hyderabad")
                .area("Madhapur").pincode("500081").isDefault(true).build());

        addressRepository.save(UserAddress.builder()
                .user(customer2).type("Office").address("Plot 12, IT Park, Hyderabad")
                .area("Gachibowli").pincode("500084").isDefault(true).build());

        ScrapRequest sr1 = scrapRequestRepository.save(ScrapRequest.builder()
                .user(customer1)
                .items("[{\"name\":\"Iron\",\"qty\":5,\"unit\":\"kg\"},{\"name\":\"Copper\",\"qty\":2,\"unit\":\"kg\"}]")
                .totalWeight(new BigDecimal("7.0"))
                .status(ScrapRequestStatus.submitted)
                .build());

        ScrapRequest sr2 = scrapRequestRepository.save(ScrapRequest.builder()
                .user(customer2)
                .items("[{\"name\":\"PET Bottles\",\"qty\":10,\"unit\":\"kg\"}]")
                .totalWeight(new BigDecimal("10.0"))
                .status(ScrapRequestStatus.approved)
                .build());

        pickupRepository.save(Pickup.builder()
                .user(customer1)
                .items(sr1.getItems())
                .timeSlot("Morning (9-12)")
                .city("Hyderabad")
                .status(PickupStatus.scheduled)
                .totalQty(2).totalWeight(new BigDecimal("7.0")).amount(new BigDecimal("990.00"))
                .build());

        pickupRepository.save(Pickup.builder()
                .user(customer2).collector(collector1)
                .items(sr2.getItems())
                .timeSlot("Afternoon (12-3)")
                .city("Hyderabad")
                .status(PickupStatus.scheduled)
                .totalQty(1).totalWeight(new BigDecimal("10.0")).amount(new BigDecimal("120.00"))
                .build());

        pickupRepository.save(Pickup.builder()
                .user(customer3).collector(collector2)
                .items("[{\"name\":\"Cardboard\",\"qty\":15,\"unit\":\"kg\"}]")
                .timeSlot("Evening (3-6)")
                .city("Hyderabad")
                .status(PickupStatus.completed)
                .totalQty(3).totalWeight(new BigDecimal("15.0")).amount(new BigDecimal("1200.00"))
                .build());

        log.info("Database seeded successfully!");
    }

    private void seedRole(String name, String displayName) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(Role.builder()
                    .name(name)
                    .displayName(displayName)
                    .build());
        }
    }

    private User createUser(String email, String rawPassword, String fullName, String phone, String roleName, BigDecimal walletBalance) {
        Role role = roleRepository.findByName(roleName).orElseThrow();
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .build();
        user.setProfile(Profile.builder()
                .user(user)
                .role(role)
                .fullName(fullName)
                .phone(phone)
                .walletBalance(walletBalance)
                .build());
        return userRepository.save(user);
    }
}
