package io.github.rrbbrb.sushirubackend.controller;

import io.github.rrbbrb.sushirubackend.dto.CartItemDto;
import io.github.rrbbrb.sushirubackend.dto.CartItemPayload;
import io.github.rrbbrb.sushirubackend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/cart-quantity")
    public ResponseEntity<Integer> initialCartQuantity() {
        int quantity = this.cartService.getInitialCartQuantity();
        if(quantity >= 0) {
            return new ResponseEntity<>(quantity, HttpStatus.OK);
        }
        return new ResponseEntity<>(0, HttpStatus.FORBIDDEN);
    }

    @GetMapping
    public ResponseEntity<List<CartItemPayload>> getCart() {
        List<CartItemPayload> cartItemDtos = cartService.listCartItems();
        if(cartItemDtos != null) {
            return new ResponseEntity<>(cartItemDtos, HttpStatus.OK);
        }
        return new ResponseEntity<>(new ArrayList<CartItemPayload>(), HttpStatus.FORBIDDEN);
    }

    @PostMapping("/new")
    public ResponseEntity<Integer> overrideExistingCart(@RequestBody List<CartItemDto> cartItemDtos) {
        int totalQuantity = cartService.replaceCart(cartItemDtos);
        if(totalQuantity >= 0) {
            return new ResponseEntity<>(totalQuantity, HttpStatus.OK);
        }
        return new ResponseEntity<>(-1, HttpStatus.FORBIDDEN);
    }

    @PutMapping("/update-item")
    public ResponseEntity<List<CartItemPayload>> updateCartItem(@RequestBody CartItemDto cartItemDto) {
        List<CartItemPayload> cartItemPayloads = cartService.updateCartItem(cartItemDto);
        if(cartItemPayloads != null) {
            return new ResponseEntity<>(cartItemPayloads, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/add-item")
    public ResponseEntity<Boolean> addCartItem(@RequestBody CartItemDto cartItemDto) {
        if(cartService.addCartItem(cartItemDto)) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/delete-item/{productName}")
    public ResponseEntity<List<CartItemPayload>> deleteCartItem(@PathVariable @RequestBody String productName) {
        List<CartItemPayload> cartItemPayloads = cartService.deleteCartItem(productName);
        if(cartItemPayloads != null) {
            return new ResponseEntity<>(cartItemPayloads, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PutMapping("/clear")
    public ResponseEntity<Boolean> clearCart(@RequestBody Iterable<CartItemDto> cartItemDtos) {
        return new ResponseEntity<>(cartService.clearCart(cartItemDtos), HttpStatus.OK);
    }

}
