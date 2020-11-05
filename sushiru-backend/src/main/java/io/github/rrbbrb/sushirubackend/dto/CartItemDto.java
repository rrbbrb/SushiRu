package io.github.rrbbrb.sushirubackend.dto;

public class CartItemDto {
    private int quantity;
    private String productName;

    public CartItemDto(int quantity, String productName) {
        this.quantity = quantity;
        this.productName = productName;
    }

    public CartItemDto() {

    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
