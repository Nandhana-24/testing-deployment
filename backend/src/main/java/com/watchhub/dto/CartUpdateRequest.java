package com.watchhub.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartUpdateRequest(@NotNull Long cartItemId, @NotNull @Min(1) Integer quantity) {}
