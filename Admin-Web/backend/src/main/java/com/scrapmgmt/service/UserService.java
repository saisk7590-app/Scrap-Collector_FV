package com.scrapmgmt.service;

import com.scrapmgmt.dto.request.UserRequest;
import com.scrapmgmt.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserResponse> getUsers(String roleName, Boolean isActive, Pageable pageable);

    UserResponse getUserById(Integer id);

    UserResponse blockUser(Integer id);

    UserResponse unblockUser(Integer id);

    UserResponse createUser(UserRequest request);

    UserResponse updateUser(Integer id, UserRequest request);

    void deleteUser(Integer id);
}
