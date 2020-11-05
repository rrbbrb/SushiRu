package io.github.rrbbrb.sushirubackend.dto;

public class CartItemPayload {
    private int quantity;
    private ProductDto productDto;

    public CartItemPayload(Integer quantity, ProductDto productDto) {
        this.quantity = quantity;
        this.productDto = productDto;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public ProductDto getProductDto() {
        return productDto;
    }

    public void setProductDto(ProductDto productDto) {
        this.productDto = productDto;
    }
}
