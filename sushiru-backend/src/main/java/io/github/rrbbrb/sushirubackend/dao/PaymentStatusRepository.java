package io.github.rrbbrb.sushirubackend.dao;

import io.github.rrbbrb.sushirubackend.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Integer> {
    @Query(value = "SELECT * FROM payment_statuses WHERE payment_status_name = :name", nativeQuery = true)
    Optional<PaymentStatus> findByPaymentStatusName(@Param("name") String name);
}
