package com.watchhub.config;

import com.watchhub.entity.AppUser;
import com.watchhub.entity.Product;
import com.watchhub.repository.ProductRepository;
import com.watchhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initializeData(
            ProductRepository products,
            UserRepository users,
            PasswordEncoder passwordEncoder,
            @Value("${WATCHHUB_ADMIN_EMAIL:}") String adminEmail,
            @Value("${WATCHHUB_ADMIN_PASSWORD:}") String adminPassword) {
        return args -> {
            if (products.count() == 0) {
                products.saveAll(List.of(
                        new Product("Chronograph 42", "AUREL", "Chronograph", new BigDecimal("429.00"), "A precise automatic chronograph with a brushed steel case and sapphire crystal.", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85", 12, 4.8),
                        new Product("Heritage Automatic", "NORTH & CO.", "Automatic", new BigDecimal("589.00"), "A timeless automatic movement framed by a deep navy dial and polished markers.", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85", 8, 4.9),
                        new Product("Minimalist 38", "STUDIO NO. 8", "Minimal", new BigDecimal("245.00"), "Clean lines, a slim profile and a soft leather strap for everyday wear.", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85", 18, 4.6),
                        new Product("Meridian Diver", "AUREL", "Sport", new BigDecimal("375.00"), "A water-ready diver with luminous hands and a unidirectional bezel.", "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=900&q=85", 9, 4.7),
                        new Product("Classic Gold 36", "MONTAIGNE", "Classic", new BigDecimal("520.00"), "Warm gold-tone detailing meets a refined cream dial and supple strap.", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85", 6, 4.8),
                        new Product("Field Watch 40", "NORTH & CO.", "Sport", new BigDecimal("310.00"), "A durable field watch designed for clear reading and long weekends.", "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=85", 14, 4.5),
                        new Product("Moonphase Atelier", "MONTAIGNE", "Automatic", new BigDecimal("760.00"), "A detailed moonphase display with a balanced dial and automatic calibre.", "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85", 4, 4.9),
                        new Product("Everyday Steel", "STUDIO NO. 8", "Minimal", new BigDecimal("195.00"), "A versatile stainless-steel essential with a crisp, understated face.", "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=900&q=85", 22, 4.4)
                ));
            }
            if (adminEmail.isBlank() != adminPassword.isBlank()) {
                throw new IllegalStateException("Set both WATCHHUB_ADMIN_EMAIL and WATCHHUB_ADMIN_PASSWORD to bootstrap an admin account");
            }
            if (!adminEmail.isBlank() && !users.existsByEmail(adminEmail.toLowerCase())) {
                users.save(new AppUser(adminEmail.toLowerCase(), "WatchHub Admin", passwordEncoder.encode(adminPassword), "ADMIN"));
            }
        };
    }
}
