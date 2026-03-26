package com.scrapmgmt.repository;

import com.scrapmgmt.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u JOIN u.profile p WHERE p.role = :role")
    Page<User> findByRole(@Param("role") com.scrapmgmt.entity.Role role, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u JOIN u.profile p WHERE p.role = :role")
    long countByRole(@Param("role") com.scrapmgmt.entity.Role role);
}
