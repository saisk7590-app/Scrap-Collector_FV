package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.request.UserRequest;
import com.scrapmgmt.dto.response.UserResponse;
import com.scrapmgmt.entity.Profile;
import com.scrapmgmt.entity.User;
import com.scrapmgmt.entity.User;
import com.scrapmgmt.exception.BadRequestException;
import com.scrapmgmt.exception.ResourceNotFoundException;
import com.scrapmgmt.mapper.UserMapper;
import com.scrapmgmt.repository.UserRepository;
import com.scrapmgmt.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.scrapmgmt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> getUsers(String roleName, Boolean isActive, Pageable pageable) {
        Page<User> users;

        if (roleName != null && !roleName.isEmpty()) {
            com.scrapmgmt.entity.Role role = roleRepository.findByName(roleName.toUpperCase()).orElse(null);
            if (role != null) {
                users = userRepository.findByRole(role, pageable);
            } else {
                users = userRepository.findAll(pageable);
            }
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(userMapper::toResponse);
    }

    @Override
    public UserResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse blockUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse unblockUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        String roleStr = request.getRole() != null ? request.getRole().toUpperCase() : "USER";
        com.scrapmgmt.entity.Role role = roleRepository.findByName(roleStr)
                .orElseThrow(() -> new BadRequestException("Role not found: " + roleStr));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "default123"))
                .build();
        user.setProfile(Profile.builder()
                .user(user)
                .role(role)
                .fullName(request.getName())
                .phone(request.getPhone())
                .build());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(Integer id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        String roleStr = request.getRole() != null ? request.getRole().toUpperCase() : "USER";
        com.scrapmgmt.entity.Role role = roleRepository.findByName(roleStr)
                .orElseThrow(() -> new BadRequestException("Role not found: " + roleStr));

        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (user.getProfile() != null) {
            user.getProfile().setRole(role);
            user.getProfile().setFullName(request.getName());
            user.getProfile().setPhone(request.getPhone());
        } else {
            user.setProfile(Profile.builder()
                    .user(user)
                    .role(role)
                    .fullName(request.getName())
                    .phone(request.getPhone())
                    .build());
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }
}
