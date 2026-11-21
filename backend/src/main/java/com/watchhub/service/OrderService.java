package com.watchhub.service;

import com.watchhub.dto.CheckoutRequest;
import com.watchhub.dto.OrderResponse;
import com.watchhub.entity.PurchaseOrder;
import com.watchhub.repository.CartItemRepository;
import com.watchhub.repository.OrderRepository;
import com.watchhub.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orders;
    private final CartItemRepository carts;
    private final UserRepository users;

    public OrderService(OrderRepository orders, CartItemRepository carts, UserRepository users) {
        this.orders = orders;
        this.carts = carts;
        this.users = users;
    }

    @Transactional
    public OrderResponse placeOrder(String email, CheckoutRequest request) {
        var user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found"));
        var cartItems = carts.findByUserOrderById(user);
        if (cartItems.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your cart is empty");

        BigDecimal total = BigDecimal.ZERO;
        for (var item : cartItems) {
            if (item.getQuantity() > item.getProduct().getStock()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient stock for " + item.getProduct().getName());
            }
            total = total.add(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        BigDecimal shipping = total.compareTo(new BigDecimal("250.00")) >= 0 ? BigDecimal.ZERO : new BigDecimal("12.00");
        total = total.add(shipping);
        var order = new PurchaseOrder(user, request.customerName(), request.email(), request.phone(), request.address(), total);
        for (var item : cartItems) {
            item.getProduct().reduceStock(item.getQuantity());
            order.addItem(item.getProduct(), item.getQuantity());
        }
        var saved = orders.save(order);
        carts.deleteAll(cartItems);
        return OrderResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersForUser(String userId, String email) {
        if (!email.equalsIgnoreCase(userId)) throw new AccessDeniedException("You can only view your own orders");
        var user = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found"));
        return orders.findByUserOrderByCreatedAtDesc(user).stream().map(OrderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orders.findAllByOrderByCreatedAtDesc().stream().map(OrderResponse::from).toList();
    }
}
