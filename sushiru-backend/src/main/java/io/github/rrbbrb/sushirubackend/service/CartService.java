package io.github.rrbbrb.sushirubackend.service;

import io.github.rrbbrb.sushirubackend.dao.CartItemRepository;
import io.github.rrbbrb.sushirubackend.dao.ProductRepository;
import io.github.rrbbrb.sushirubackend.dto.CartItemDto;
import io.github.rrbbrb.sushirubackend.dto.CartItemPayload;
import io.github.rrbbrb.sushirubackend.entity.CartItem;
import io.github.rrbbrb.sushirubackend.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    public Integer getInitialCartQuantity() {
        if(userService.getCurrentUser().isPresent()) {
            String username = userService.getCurrentUser().get().getUsername();
            Set<CartItem> cartItems = userService.userFromDB(username).getCartItems();
            if(cartItems.isEmpty() || cartItems == null) {
                return 0;
            } else {
                return cartItems
                        .stream()
                        .filter(item -> item.getProduct().isEnabled())
                        .mapToInt(CartItem::getQuantity)
                        .sum();
            }

        } else {
            return -1;
        }
    }

    public List<CartItemPayload> listCartItems() {
        if(userService.getCurrentUser().isPresent()) {
            String username = userService.getCurrentUser().get().getUsername();
            Set<CartItem> cartItems = userService.userFromDB(username).getCartItems();
            if(cartItems != null) {
                List<CartItem> cartItemList = cartItems
                        .stream()
                        .sorted(Comparator.comparing(CartItem::getId))
                        .collect(Collectors.toList());
                List<CartItemPayload> cartItemPayloads = new ArrayList<>();
                cartItemList.forEach( item -> {
                    cartItemPayloads.add(new CartItemPayload(item.getQuantity(),
                            productService.mapFromProductToProductDto(item.getProduct())));
                });
                return cartItemPayloads;
            }
        }
        return null;
    }

    public Integer replaceCart(List<CartItemDto> cartItemDtos) {
        if(userService.getCurrentUser().isPresent()) {
            String username = userService.getCurrentUser().get().getUsername();
            io.github.rrbbrb.sushirubackend.entity.User user = userService.userFromDB(username);
            Optional<List<CartItem>> cartItems = cartItemRepository.findAllByUserId(user.getId());
            cartItems.ifPresent(items -> cartItemRepository.deleteAll(items));
            cartItemDtos.forEach( item -> {
                CartItem cartItem = new CartItem();
                productRepository.findByProductName(item.getProductName()).ifPresent(cartItem::setProduct);
                cartItem.setQuantity(item.getQuantity());
                cartItem.setUser(user);
                cartItemRepository.save(cartItem);
            });
            return user.getCartItems().stream().mapToInt(CartItem::getQuantity).sum();
        }
        return -1;
    }

    public List<CartItemPayload> updateCartItem(CartItemDto cartItemDto) {
        Optional<CartItem> cartItem = findCartItem(cartItemDto.getProductName());
        if(cartItem.isPresent()) {
            int newQuantity = cartItemDto.getQuantity();
            if(newQuantity > 0) {
                cartItem.get().setQuantity(newQuantity);
                cartItemRepository.save(cartItem.get());
            } else {
                cartItemRepository.delete(cartItem.get());
            }
            Set<CartItem> cartItems = userService.userFromDB(userService.getCurrentUser().get().getUsername()).getCartItems();
            List<CartItem> cartItemList = cartItems
                    .stream()
                    .sorted(Comparator.comparing(CartItem::getId))
                    .collect(Collectors.toList());
            List<CartItemPayload> cartItemPayloads = new ArrayList<>();
            cartItemList.forEach( item -> {
                cartItemPayloads.add(new CartItemPayload(item.getQuantity(),
                        productService.mapFromProductToProductDto(item.getProduct())));
            });
            return cartItemPayloads;
        }
        return null;
    }

    public boolean addCartItem(CartItemDto cartItemDto) {
        Optional<User> user = userService.getCurrentUser();
        if(user.isPresent()) {
            Optional<CartItem> cartItem = findCartItem(cartItemDto.getProductName());
            if(cartItem.isEmpty()) {
                io.github.rrbbrb.sushirubackend.entity.User userFromDB = userService.userFromDB(user.get().getUsername());
                CartItem newCartItem = new CartItem();
                newCartItem.setQuantity(cartItemDto.getQuantity());
                productRepository.findByProductName(cartItemDto.getProductName()).ifPresent(newCartItem::setProduct);
                newCartItem.setUser(userFromDB);
                cartItemRepository.save(newCartItem);
            } else {
                cartItem.get().setQuantity(cartItem.get().getQuantity() + cartItemDto.getQuantity());
                cartItemRepository.save(cartItem.get());
            }
            return true;
        }
        return false;
    }

    public List<CartItemPayload> deleteCartItem(String productName) {
        Optional<CartItem> cartItem = findCartItem(productName);
        if(cartItem.isPresent()) {
            cartItemRepository.delete(cartItem.get());
            Set<CartItem> cartItems = userService.userFromDB(userService.getCurrentUser().get().getUsername()).getCartItems();
            List<CartItem> cartItemList = cartItems
                    .stream()
                    .sorted(Comparator.comparing(CartItem::getId))
                    .collect(Collectors.toList());
            List<CartItemPayload> cartItemPayloads = new ArrayList<>();
            cartItemList.forEach( item -> {
                cartItemPayloads.add(new CartItemPayload(item.getQuantity(),
                        productService.mapFromProductToProductDto(item.getProduct())));
            });
            return cartItemPayloads;
        }
        return null;
    }

    public boolean clearCart(Iterable<CartItemDto> cartItemDtos) {
        cartItemDtos.forEach(itemDto -> {
            Optional<CartItem> cartItem = findCartItem(itemDto.getProductName());
            cartItem.ifPresent(item -> cartItemRepository.delete(item));
        });
        return true;
    }

//    ----------------- HELPER METHODS -----------------

    private Optional<CartItem> findCartItem(String productName) {
        Optional<User> user = userService.getCurrentUser();
        Optional<Product> product = productRepository.findByProductName(productName);
        if(user.isPresent() && product.isPresent()) {
            String username = user.get().getUsername();
            io.github.rrbbrb.sushirubackend.entity.User userFromDB = userService.userFromDB(username);
            int productId = product.get().getId();
            return cartItemRepository.findByUserIdAndProductId(userFromDB.getId(), productId);
        }
        return Optional.empty();
}

    public CartItemDto mapFromCartItemToCartItemDto(CartItem cartItem) {
        CartItemDto cartItemDto = new CartItemDto();
        cartItemDto.setProductName(cartItem.getProduct().getProductName());
        cartItemDto.setQuantity(cartItem.getQuantity());
        return cartItemDto;
    }
}
