package com.scrapmgmt.service;

import com.scrapmgmt.dto.request.AddressRequest;
import com.scrapmgmt.dto.response.AddressResponse;

import java.util.List;

public interface AddressService {

    List<AddressResponse> getAddressesByUser(Integer userId);

    AddressResponse createAddress(AddressRequest request);

    AddressResponse updateAddress(Integer id, AddressRequest request);

    void deleteAddress(Integer id);

    AddressResponse setDefaultAddress(Integer id);
}
