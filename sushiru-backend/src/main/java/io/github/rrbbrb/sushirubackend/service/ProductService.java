package io.github.rrbbrb.sushirubackend.service;

import io.github.rrbbrb.sushirubackend.dao.CartItemRepository;
import io.github.rrbbrb.sushirubackend.dao.ProductCategoryRepository;
import io.github.rrbbrb.sushirubackend.dao.ProductRepository;
import io.github.rrbbrb.sushirubackend.dto.CartItemDto;
import io.github.rrbbrb.sushirubackend.dto.ProductCategoryDto;
import io.github.rrbbrb.sushirubackend.dto.ProductDto;
import io.github.rrbbrb.sushirubackend.entity.CartItem;
import io.github.rrbbrb.sushirubackend.entity.Product;
import io.github.rrbbrb.sushirubackend.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserService userService;

    public List<ProductDto> listAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapFromProductToProductDto)
                .collect(Collectors.toList());
    }

    public List<ProductCategoryDto> listAllCategories() {
        return productCategoryRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(ProductCategory::getId))
                .map(this::mapFromCategoryToCategoryDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> listProductsByCategory(Integer id) {
        return productRepository.findByCategoryId(id)
                .stream()
                .map(this::mapFromProductToProductDto)
                .collect(Collectors.toList());
    }

    public HashMap<String, List<CartItemDto>> decreaseUnitsInStock(Iterable<CartItemDto> userCartItems) {
        Optional<User> user = userService.getCurrentUser();
        if(user.isPresent()) {
            List<CartItemDto> changesInCart = new ArrayList<>(), stocksDecreased = new ArrayList<>();
            userCartItems.forEach( item -> {
                Optional<Product> productOptional = productRepository.findByProductName(item.getProductName());
                if(productOptional.isPresent()) {
                    Product product = productOptional.get();
                    if(product.isEnabled()) {
                        int newUnitsInStock = product.getUnitsInStock() - item.getQuantity();
                        if(newUnitsInStock >= 0) {
                            stocksDecreased.add(new CartItemDto(item.getQuantity(), product.getProductName()));
                            product.setUnitsInStock(newUnitsInStock);
                            if(newUnitsInStock == 0) {
                                product.setEnabled(false);
                            }
                        } else {
                            int exceededQuantity = -newUnitsInStock;
                            int cartNewQuantity = item.getQuantity() - exceededQuantity;
                            product.setUnitsInStock(0);
                            product.setEnabled(false);
                            stocksDecreased.add(new CartItemDto(cartNewQuantity, product.getProductName()));
                            int userId = userService.userFromDB(user.get().getUsername()).getId();
                            Optional<CartItem> cartItem = cartItemRepository.findByUserIdAndProductId(userId, product.getId());
                            cartItem.ifPresent(itemInDB -> {
                                itemInDB.setQuantity(cartNewQuantity);
                                cartItemRepository.save(itemInDB);
                            });
                            changesInCart.add(new CartItemDto(cartNewQuantity, product.getProductName()));
                        }
                        productRepository.save(product);
                    } else {
                        changesInCart.add(new CartItemDto(0, product.getProductName()));
                    }
                }
            });
            HashMap<String, List<CartItemDto>> changesAndDecreases = new HashMap<>();
            changesAndDecreases.put("cartChanges", changesInCart);
            changesAndDecreases.put("stockChanges", stocksDecreased);
            return changesAndDecreases;
        }
        return null;
    }

    public boolean addBackUnitsInStock(Iterable<CartItemDto> cartItems) {
        Optional<User> user = userService.getCurrentUser();
        if(user.isPresent()) {
            cartItems.forEach( item -> {
                Optional<Product> productOptional = productRepository.findByProductName(item.getProductName());
                productOptional.ifPresent(product -> {
                    if(!product.isEnabled()) {
                        product.setEnabled(true);
                    }
                    product.setUnitsInStock(product.getUnitsInStock() + item.getQuantity());
                    productRepository.save(product);
                });
            });
            return true;
        }
        return false;
    }

    public ProductDto mapFromProductToProductDto(Product product) {
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setProductName(product.getProductName());
        productDto.setImageURL(product.getImageURL());
        productDto.setUnitsInStock(product.getUnitsInStock());
        productDto.setEnabled(product.isEnabled());
        productDto.setCategoryName(product.getCategory().getCategoryName());
        return productDto;
    }

    private ProductCategoryDto mapFromCategoryToCategoryDto(ProductCategory productCategory) {
        return new ProductCategoryDto(productCategory.getId(), productCategory.getCategoryName());
    }

}
