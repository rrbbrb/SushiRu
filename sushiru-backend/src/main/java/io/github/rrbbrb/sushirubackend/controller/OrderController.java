package io.github.rrbbrb.sushirubackend.controller;

import io.github.rrbbrb.sushirubackend.dto.OrderDto;
import io.github.rrbbrb.sushirubackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getOrdersByUser() {
        return new ResponseEntity<>(orderService.getOrdersByUser(), HttpStatus.OK);
    }

    @PostMapping("/place-order")
    public ResponseEntity<Boolean> checkOutOrder(@RequestBody OrderDto orderDto) {
        switch(orderService.addNewOrder(orderDto)) {
            case "bad request":
                return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
            case "OK":
                return new ResponseEntity<>(true, HttpStatus.OK);
            default:
                return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
        }
    }
}
