package com.scrapmgmt.controller;

import com.scrapmgmt.dto.request.AddressRequest;
import com.scrapmgmt.dto.response.AddressResponse;
import com.scrapmgmt.dto.response.ApiResponse;
import com.scrapmgmt.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddressesByUser(@PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(ApiResponse.ok(addressService.getAddressesByUser(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> createAddress(@Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Address created", addressService.createAddress(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @PathVariable("id") Integer id, @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Address updated", addressService.updateAddress(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable("id") Integer id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted"));
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<ApiResponse<AddressResponse>> setDefaultAddress(@PathVariable("id") Integer id) {
        return ResponseEntity.ok(ApiResponse.ok("Default address set", addressService.setDefaultAddress(id)));
    }
}
