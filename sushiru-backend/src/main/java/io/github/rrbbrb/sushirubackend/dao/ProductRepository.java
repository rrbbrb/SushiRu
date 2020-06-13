package io.github.rrbbrb.sushirubackend.dao;

import io.github.rrbbrb.sushirubackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    
}
