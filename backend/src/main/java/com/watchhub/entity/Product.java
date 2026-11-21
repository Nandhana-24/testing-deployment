package com.watchhub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String name;

    @NotBlank @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String brand;

    @NotBlank @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String category;

    @NotNull @DecimalMin("0.01")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotBlank @Size(max = 1000)
    @Column(nullable = false, length = 1000)
    private String description;

    @NotBlank @Size(max = 1000)
    @Column(nullable = false, length = 1000)
    private String imageUrl;

    @NotNull @Min(0)
    @Column(nullable = false)
    private Integer stock;

    @DecimalMin("0.0") @DecimalMax("5.0")
    @Column(nullable = false)
    private Double rating = 4.5;

    protected Product() {}

    public Product(String name, String brand, String category, BigDecimal price,
                   String description, String imageUrl, Integer stock, Double rating) {
        this.name = name;
        this.brand = brand;
        this.category = category;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.stock = stock;
        this.rating = rating;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getBrand() { return brand; }
    public String getCategory() { return category; }
    public BigDecimal getPrice() { return price; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public Integer getStock() { return stock; }
    public Double getRating() { return rating; }

    public void updateFrom(Product source) {
        name = source.name;
        brand = source.brand;
        category = source.category;
        price = source.price;
        description = source.description;
        imageUrl = source.imageUrl;
        stock = source.stock;
        rating = source.rating;
    }

    public void reduceStock(int amount) {
        if (stock < amount) throw new IllegalStateException("Insufficient stock for " + name);
        stock -= amount;
    }
}
