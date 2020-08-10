package io.github.rrbbrb.sushirubackend.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "order_statuses")
@Getter
@Setter
public class OrderStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "order_status_name")
    private String orderStatusName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "orderStatus")
    private Set<Order> orders;

}
