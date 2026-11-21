package com.watchhub.repository;

import com.watchhub.entity.AppUser;
import com.watchhub.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findByUserOrderByCreatedAtDesc(AppUser user);
    List<PurchaseOrder> findAllByOrderByCreatedAtDesc();
}
