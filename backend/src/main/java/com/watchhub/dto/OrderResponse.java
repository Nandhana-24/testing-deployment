package com.watchhub.dto;

import com.watchhub.entity.PurchaseOrder;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id, Long userId, String customerName, String email, String phone, String address,
        BigDecimal total, String status, Instant createdAt, List<OrderItemResponse> items) {
    public static OrderResponse from(PurchaseOrder order) {
        return new OrderResponse(order.getId(), order.getUser().getId(), order.getCustomerName(),
                order.getEmail(), order.getPhone(), order.getAddress(), order.getTotal(),
                order.getStatus(), order.getCreatedAt(),
                order.getItems().stream().map(OrderItemResponse::from).toList());
    }
}
