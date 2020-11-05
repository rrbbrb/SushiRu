package io.github.rrbbrb.sushirubackend.dao;

import io.github.rrbbrb.sushirubackend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByCategoryId(@RequestParam("id") Integer id);

    @Query(value = "SELECT * FROM products WHERE product_name = :name", nativeQuery = true)
    Optional<Product> findByProductName(@Param("name") String name);
}
