package io.github.rrbbrb.sushirubackend.dao;

import io.github.rrbbrb.sushirubackend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Integer> {
    @Query(value = "SELECT * FROM order_statuses WHERE order_status_name = :name", nativeQuery = true)
    Optional<OrderStatus> findByOrderStatusName(@Param("name") String name);
}
