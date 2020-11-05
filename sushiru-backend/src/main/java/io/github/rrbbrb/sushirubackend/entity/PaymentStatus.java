package io.github.rrbbrb.sushirubackend.entity;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "payment_statuses")
public class PaymentStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "payment_status_name")
    private String paymentStatusName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "paymentStatus")
    private Set<Order> orders;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPaymentStatusName() {
        return paymentStatusName;
    }

    public void setPaymentStatusName(String paymentStatusName) {
        this.paymentStatusName = paymentStatusName;
    }

    public Set<Order> getOrders() {
        return orders;
    }

    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }
}
