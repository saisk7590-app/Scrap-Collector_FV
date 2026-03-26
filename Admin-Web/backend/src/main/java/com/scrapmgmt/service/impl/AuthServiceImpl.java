package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.request.LoginRequest;
import com.scrapmgmt.dto.request.RegisterRequest;
import com.scrapmgmt.dto.response.LoginResponse;
import com.scrapmgmt.dto.response.UserResponse;
import com.scrapmgmt.entity.Profile;
import com.scrapmgmt.entity.User;
import com.scrapmgmt.exception.BadRequestException;
import com.scrapmgmt.mapper.UserMapper;
import com.scrapmgmt.repository.UserRepository;
import com.scrapmgmt.repository.RoleRepository;
import com.scrapmgmt.security.JwtTokenProvider;
import com.scrapmgmt.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String name = user.getProfile() != null ? user.getProfile().getFullName() : null;
        String roleName = (user.getProfile() != null && user.getProfile().getRole() != null)
                ? user.getProfile().getRole().getName() : "USER";

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .name(name)
                .email(user.getEmail())
                .role(roleName)
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        String roleStr = request.getRole() != null ? request.getRole().toUpperCase() : "USER";
        com.scrapmgmt.entity.Role role = roleRepository.findByName(roleStr)
                .orElseThrow(() -> new BadRequestException("Role not found: " + roleStr));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        Profile profile = Profile.builder()
                .user(user)
                .role(role)
                .fullName(request.getName())
                .phone(request.getPhone())
                .build();
        user.setProfile(profile);

        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }
}
