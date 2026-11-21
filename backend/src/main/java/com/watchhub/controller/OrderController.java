package com.watchhub.controller;

import com.watchhub.dto.CheckoutRequest;
import com.watchhub.dto.OrderResponse;
import com.watchhub.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(@Valid @RequestBody CheckoutRequest request, Authentication authentication) {
        return orderService.placeOrder(authentication.getName(), request);
    }

    @GetMapping("/{userId}")
    public List<OrderResponse> byUser(@PathVariable String userId, Authentication authentication) {
        return orderService.getOrdersForUser(userId, authentication.getName());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> all() {
        return orderService.getAllOrders();
    }
}
