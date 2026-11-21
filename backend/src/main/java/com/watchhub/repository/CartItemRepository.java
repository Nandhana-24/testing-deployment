package com.watchhub.repository;

import com.watchhub.entity.AppUser;
import com.watchhub.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserOrderById(AppUser user);
    Optional<CartItem> findByIdAndUser(Long id, AppUser user);

    @Modifying
    @Query("delete from CartItem item where item.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}
