package com.scrapmgmt.mapper;

import com.scrapmgmt.dto.response.UserResponse;
import com.scrapmgmt.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface UserMapper {

    @Mapping(target = "name", expression = "java(user.getProfile() != null ? user.getProfile().getFullName() : null)")
    @Mapping(target = "phone", expression = "java(user.getProfile() != null ? user.getProfile().getPhone() : null)")
    @Mapping(target = "role", expression = "java(user.getProfile() != null && user.getProfile().getRole() != null ? user.getProfile().getRole().getName() : null)")
    @Mapping(target = "walletBalance", expression = "java(user.getProfile() != null ? user.getProfile().getWalletBalance() : null)")
    @Mapping(target = "isActive", expression = "java(true)")
    @Mapping(target = "city", expression = "java(null)")
    @Mapping(target = "state", expression = "java(null)")
    @Mapping(target = "avatarUrl", expression = "java(null)")
    UserResponse toResponse(User user);
}
