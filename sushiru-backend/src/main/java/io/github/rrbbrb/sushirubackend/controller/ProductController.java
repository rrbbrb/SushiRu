package io.github.rrbbrb.sushirubackend.controller;

import io.github.rrbbrb.sushirubackend.dto.CartItemDto;
import io.github.rrbbrb.sushirubackend.dto.ProductCategoryDto;
import io.github.rrbbrb.sushirubackend.dto.ProductDto;
import io.github.rrbbrb.sushirubackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return new ResponseEntity<>(productService.listAllProducts(), HttpStatus.OK);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ProductCategoryDto>> getAllCategories() {
        return new ResponseEntity<>(productService.listAllCategories(), HttpStatus.OK);
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(@PathVariable @RequestBody Integer id) {
        List<ProductDto> productDtos = productService.listProductsByCategory(id);
        if(productDtos != null) {
            return new ResponseEntity<>(productDtos, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/decrease-units")
    public ResponseEntity<HashMap<String, List<CartItemDto>>> decreaseUnitsInStock(@RequestBody Iterable<CartItemDto> userCartItems) {
        return new ResponseEntity<>(productService.decreaseUnitsInStock(userCartItems), HttpStatus.OK);
    }

    @PutMapping("/add-back")
    public ResponseEntity<Boolean> addBackUnitsInStock(@RequestBody Iterable<CartItemDto> cartItems) {
        if(productService.addBackUnitsInStock(cartItems)) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        }
        return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
    }

}
