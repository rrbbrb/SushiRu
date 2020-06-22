package io.github.rrbbrb.sushirubackend.dao;

import io.github.rrbbrb.sushirubackend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findByCategoryId(@RequestParam("id") Integer id, Pageable pageable);
}
