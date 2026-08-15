package com.smartqueue.mapper;

import com.smartqueue.dto.request.UserRequest;
import com.smartqueue.dto.response.UserResponse;
import com.smartqueue.entity.User;
import org.springframework.stereotype.Component;

/**
 * Converts between User entity and its DTOs.
 */
@Component
public class UserMapper {

    public User toEntity(UserRequest request) {
        return User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
