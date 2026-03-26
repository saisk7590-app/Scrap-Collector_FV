package com.scrapmgmt.controller;

import com.scrapmgmt.dto.request.UserRequest;
import com.scrapmgmt.dto.response.ApiResponse;
import com.scrapmgmt.dto.response.PagedResponse;
import com.scrapmgmt.dto.response.UserResponse;
import com.scrapmgmt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getUsers(
            @RequestParam(name = "role", required = false) String role,
            @RequestParam(name = "isActive", required = false) Boolean isActive,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String roleName = role != null ? role.toUpperCase() : null;
        Page<UserResponse> users = userService.getUsers(roleName, isActive, pageable);

        return ResponseEntity.ok(ApiResponse.ok(PagedResponse.of(users)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUserById(id)));
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<ApiResponse<UserResponse>> blockUser(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("User blocked", userService.blockUser(id)));
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<ApiResponse<UserResponse>> unblockUser(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("User unblocked", userService.unblockUser(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User created", userService.createUser(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable("id") Integer id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("User updated", userService.updateUser(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable("id") Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }
}
