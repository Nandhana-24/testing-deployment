package com.watchhub.controller;

import com.watchhub.dto.CartAddRequest;
import com.watchhub.dto.CartItemResponse;
import com.watchhub.dto.CartUpdateRequest;
import com.watchhub.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public List<CartItemResponse> get(@PathVariable String userId, Authentication authentication) {
        return cartService.getCart(userId, authentication.getName());
    }

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public CartItemResponse add(@Valid @RequestBody CartAddRequest request, Authentication authentication) {
        return cartService.add(authentication.getName(), request);
    }

    @PutMapping("/update")
    public CartItemResponse update(@Valid @RequestBody CartUpdateRequest request, Authentication authentication) {
        return cartService.update(authentication.getName(), request);
    }

    @DeleteMapping("/remove/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long id, Authentication authentication) {
        cartService.remove(authentication.getName(), id);
    }
}
