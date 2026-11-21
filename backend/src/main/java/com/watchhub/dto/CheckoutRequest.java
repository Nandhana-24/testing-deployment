package com.watchhub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CheckoutRequest(
        @NotBlank @Size(max = 100) String customerName,
        @NotBlank @Email @Size(max = 180) String email,
        @NotBlank @Size(max = 30) String phone,
        @NotBlank @Size(max = 500) String address) {}
