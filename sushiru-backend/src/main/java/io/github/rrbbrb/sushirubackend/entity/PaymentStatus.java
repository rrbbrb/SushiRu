package io.github.rrbbrb.sushirubackend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "payment_statuses")
@Getter
@Setter
public class PaymentStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "payment_status_name")
    private String paymentStatusName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "paymentStatus")
    private Set<Order> orders;
}
