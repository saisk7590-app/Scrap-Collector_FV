package com.scrapmgmt.service;

import com.scrapmgmt.dto.request.LoginRequest;
import com.scrapmgmt.dto.request.RegisterRequest;
import com.scrapmgmt.dto.response.LoginResponse;
import com.scrapmgmt.dto.response.UserResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    UserResponse register(RegisterRequest request);
}
