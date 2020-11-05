import { ProductDto } from './product';

export class CartItemPayload {
    constructor(quantity: number, productDto: ProductDto) {
        this.quantity = quantity;
        this.productDto = productDto;
    }
    quantity: number;
    productDto: ProductDto;
}