export class OrderItem {

    constructor(quantity: number, productName: string) {
        this.quantity = quantity;
        this.productName = productName;
    }
    quantity: number;
    productName: string;
}