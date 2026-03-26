package com.scrapmgmt.repository;

import com.scrapmgmt.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Integer> {

    List<UserAddress> findByUser_Id(Integer userId);

    Optional<UserAddress> findByUser_IdAndIsDefaultTrue(Integer userId);
}
