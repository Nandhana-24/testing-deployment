package com.watchhub.dto;

import com.watchhub.entity.CartItem;
import java.math.BigDecimal;

public record CartItemResponse(
        Long id, Long productId, String name, String brand, String imageUrl,
        BigDecimal price, Integer quantity, Integer stock, BigDecimal lineTotal) {
    public static CartItemResponse from(CartItem item) {
        var product = item.getProduct();
        return new CartItemResponse(item.getId(), product.getId(), product.getName(), product.getBrand(),
                product.getImageUrl(), product.getPrice(), item.getQuantity(), product.getStock(),
                product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
    }
}
