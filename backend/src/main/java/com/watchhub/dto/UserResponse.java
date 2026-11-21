package com.watchhub.dto;

import com.watchhub.entity.AppUser;

public record UserResponse(Long id, String name, String email, String role) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
