package com.scrapmgmt.service.impl;

import com.scrapmgmt.dto.request.AddressRequest;
import com.scrapmgmt.dto.response.AddressResponse;
import com.scrapmgmt.entity.User;
import com.scrapmgmt.entity.UserAddress;
import com.scrapmgmt.exception.ResourceNotFoundException;
import com.scrapmgmt.mapper.AddressMapper;
import com.scrapmgmt.repository.UserAddressRepository;
import com.scrapmgmt.repository.UserRepository;
import com.scrapmgmt.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final UserAddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    @Override
    public List<AddressResponse> getAddressesByUser(Integer userId) {
        return addressRepository.findByUser_Id(userId).stream()
                .map(addressMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressResponse createAddress(AddressRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        UserAddress address = addressMapper.toEntity(request);
        address.setUser(user);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearDefaultForUser(user.getId());
        }

        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Integer id, AddressRequest request) {
        UserAddress address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserAddress", "id", id));
        addressMapper.updateEntity(request, address);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearDefaultForUser(address.getUser().getId());
            address.setIsDefault(true);
        }

        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(Integer id) {
        if (!addressRepository.existsById(id)) {
            throw new ResourceNotFoundException("UserAddress", "id", id);
        }
        addressRepository.deleteById(id);
    }

    @Override
    @Transactional
    public AddressResponse setDefaultAddress(Integer id) {
        UserAddress address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserAddress", "id", id));

        clearDefaultForUser(address.getUser().getId());
        address.setIsDefault(true);

        return addressMapper.toResponse(addressRepository.save(address));
    }

    private void clearDefaultForUser(Integer userId) {
        addressRepository.findByUser_IdAndIsDefaultTrue(userId)
                .ifPresent(defaultAddr -> {
                    defaultAddr.setIsDefault(false);
                    addressRepository.save(defaultAddr);
                });
    }
}
