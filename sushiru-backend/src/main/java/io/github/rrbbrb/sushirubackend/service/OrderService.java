package io.github.rrbbrb.sushirubackend.service;

import io.github.rrbbrb.sushirubackend.dao.*;
import io.github.rrbbrb.sushirubackend.dto.AddressDto;
import io.github.rrbbrb.sushirubackend.dto.OrderDto;
import io.github.rrbbrb.sushirubackend.dto.OrderItemDto;
import io.github.rrbbrb.sushirubackend.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private PaymentStatusRepository paymentStatusRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public List<OrderDto> getOrdersByUser() {
        Optional<User> currentUser = userService.getCurrentUser();
        if(currentUser.isPresent()) {
            String username = currentUser.get().getUsername();
            int id = userService.userFromDB(username).getId();
            List<Order> orders = allOrdersByUser(id);
            return orders.stream().map(this::mapFromOrderToOrderDto).collect(Collectors.toList());
        }
        return null;
    }

    public String addNewOrder(OrderDto orderDto) {
        Optional<User> currentUser = userService.getCurrentUser();
        AddressDto addressDto = orderDto.getAddressDto();
        Iterable<OrderItemDto> orderItemDtos = orderDto.getOrderItemDtos();
        if(addressDto == null || orderItemDtos == null || userService.anyFieldEmptyOrNull(addressDto)) {
            return "bad request";
        }
        if(currentUser.isPresent()) {
            Order order = new Order();
            io.github.rrbbrb.sushirubackend.entity.User user = userService.userFromDB(currentUser.get().getUsername());
            order.setUser(user);
            if(user.getFullName() == null) {
                userService.setAddress(user, addressDto);
                userRepository.save(user);
            }
            addOrderDetails(order, orderDto);
            addAddressDetails(order, addressDto);
            orderRepository.save(order);
            addOrderItems(order, orderItemDtos);

            return "OK";
        }
        return "forbidden";
    }

//    -------------------------------- HELPER METHODS --------------------------------

    private void addOrderDetails(Order order, OrderDto orderDto) {
        Optional<OrderStatus> orderStatus = orderStatusRepository.findByOrderStatusName("Received");
        orderStatus.ifPresent(order::setOrderStatus);
        order.setTotalQuantity(orderDto.getTotalQuantity());
        order.setTotalAmount(orderDto.getTotalAmount());
        Optional<PaymentStatus> paymentStatus = paymentStatusRepository.findByPaymentStatusName("Unpaid");
        paymentStatus.ifPresent(order::setPaymentStatus);
        order.setPaymentMethod("Pay on Delivery");
    }

    private void addAddressDetails(Order order, AddressDto addressDto) {
        order.setCustomerFullName(addressDto.getFullName());
        order.setContactNumber(addressDto.getContactNumber());
        order.setAddress(addressDto.getAddress());
        order.setDistrict(addressDto.getDistrict());
        order.setCity(addressDto.getCity());
    }

    private void addOrderItems(Order order, Iterable<OrderItemDto> orderItemDtos) {
        orderItemDtos.forEach(item -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(item.getQuantity());
            findProductByName(item.getProductName()).ifPresent(orderItem::setProduct);
            orderItem.setOrder(order);
            orderItemRepository.save(orderItem);
        });
    }

    public List<Order> allOrdersByUser(Integer id) {
        return orderRepository.findAllByUserId(id);
    }

    private Optional<Product> findProductByName(String productName) {
        return productRepository.findByProductName(productName);
    }

    private OrderDto mapFromOrderToOrderDto(Order order) {
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setDateCreated(order.getDateCreated());
        orderDto.setLastUpdated(order.getLastUpdated());
        orderDto.setOrderStatusName(order.getOrderStatus().getOrderStatusName());
        orderDto.setTotalQuantity(order.getTotalQuantity());
        orderDto.setTotalAmount(order.getTotalAmount());
        orderDto.setPaymentMethod(order.getPaymentMethod());
        orderDto.setPaymentStatusName(order.getPaymentStatus().getPaymentStatusName());
        AddressDto addressDto = new AddressDto();
        addressDto.setFullName(order.getCustomerFullName());
        addressDto.setContactNumber(order.getContactNumber());
        addressDto.setAddress(order.getAddress());
        addressDto.setDistrict(order.getDistrict());
        addressDto.setCity(order.getCity());
        orderDto.setAddressDto(addressDto);
        return orderDto;
    }
}
