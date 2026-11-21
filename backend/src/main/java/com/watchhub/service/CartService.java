package com.watchhub.service;

import com.watchhub.dto.CartAddRequest;
import com.watchhub.dto.CartItemResponse;
import com.watchhub.dto.CartUpdateRequest;
import com.watchhub.entity.AppUser;
import com.watchhub.entity.CartItem;
import com.watchhub.repository.CartItemRepository;
import com.watchhub.repository.ProductRepository;
import com.watchhub.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CartService {
    private final CartItemRepository carts;
    private final ProductRepository products;
    private final UserRepository users;

    public CartService(CartItemRepository carts, ProductRepository products, UserRepository users) {
        this.carts = carts;
        this.products = products;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(String userId, String email) {
        ensureOwner(userId, email);
        AppUser user = findUser(email);
        return carts.findByUserOrderById(user).stream().map(CartItemResponse::from).toList();
    }

    @Transactional
    public CartItemResponse add(String email, CartAddRequest request) {
        AppUser user = findUser(email);
        var product = products.findById(request.productId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        var existing = carts.findByUserOrderById(user).stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();
        int quantity = existing.map(item -> item.getQuantity() + request.quantity()).orElse(request.quantity());
        if (quantity > product.getStock()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested quantity exceeds available stock");
        }
        CartItem item = existing.orElseGet(() -> new CartItem(user, product, request.quantity()));
        item.setQuantity(quantity);
        return CartItemResponse.from(carts.save(item));
    }

    @Transactional
    public CartItemResponse update(String email, CartUpdateRequest request) {
        AppUser user = findUser(email);
        CartItem item = carts.findByIdAndUser(request.cartItemId(), user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        if (request.quantity() > item.getProduct().getStock()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Requested quantity exceeds available stock");
        }
        item.setQuantity(request.quantity());
        return CartItemResponse.from(item);
    }

    @Transactional
    public void remove(String email, Long id) {
        AppUser user = findUser(email);
        CartItem item = carts.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        carts.delete(item);
    }

    private AppUser findUser(String email) {
        return users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not found"));
    }

    private void ensureOwner(String userId, String email) {
        if (!email.equalsIgnoreCase(userId)) throw new AccessDeniedException("You can only access your own cart");
    }
}
