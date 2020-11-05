package io.github.rrbbrb.sushirubackend.dao;

import io.github.rrbbrb.sushirubackend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    @Query(value = "SELECT * FROM cart_items WHERE user_id = :id AND product_id = :p_id", nativeQuery = true)
    Optional<CartItem> findByUserIdAndProductId(@Param("id") Integer id, @Param("p_id") Integer p_id);

    @Query(value = "SELECT * FROM cart_items WHERE user_id = :id", nativeQuery = true)
    Optional<List<CartItem>> findAllByUserId(@Param("id") Integer id);
}
