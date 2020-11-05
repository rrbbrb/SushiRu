import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEventPattern } from 'rxjs';
import { Address } from 'src/app/common/address';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  order: Order;
  deliveryAddress: Address;
  private price: number = 40;
  deliveryCost: number = 40;
  orderForm: FormGroup;
  checkingOut: boolean = false;

  constructor(private checkoutService: CheckoutService, private productService: ProductService, private router: Router) {
    this.order = new Order();
    this.deliveryAddress = new Address();
    this.checkoutService.currentOrderToPlace.subscribe(order => {
      this.order = order;
    });
    this.orderForm = new FormGroup({
      fullName: new FormControl(),
      contactNumber: new FormControl(),
      address: new FormControl(),
      district: new FormControl(),
      city: new FormControl('Taipei City')
    });
    console.log(this.order);
    if(this.order !== null) {
      const addressDto = this.order.addressDto;
      this.orderForm.patchValue({
        fullName: addressDto.fullName,
        contactNumber: addressDto.contactNumber,
        address: addressDto.address,
        district: addressDto.district
      });
      this.orderForm.get('city').disable();
    }
  }

  ngOnInit(): void { }

  foodCost(): number {
    let sum = 0;
    this.order.orderItemDtos.forEach(item => {
      sum += this.price * item.quantity;
    });
    return sum;
  }

  calculateSubtotal(quantity: number) {
    return this.price * quantity;
  }

  calculateTotal(): number {
    return this.foodCost() + this.deliveryCost;
  }

  onPlaceOrder() {
    this.deliveryAddress.fullName = this.orderForm.get('fullName').value;
    this.deliveryAddress.contactNumber = this.orderForm.get('contactNumber').value;
    this.deliveryAddress.address = this.orderForm.get('address').value;
    this.deliveryAddress.district = this.orderForm.get('district').value;
    this.deliveryAddress.city = this.orderForm.get('city').value;
    this.order.addressDto = this.deliveryAddress;
    console.log(`order: ${JSON.stringify(this.order)}`);
    console.log(`order items: ${JSON.stringify(this.order.orderItemDtos)}`);
    this.checkoutService.placeOrder(this.order).subscribe(data => {
      console.log(`order placed? : ${data}`);
      if(data) {
        this.checkingOut = true;
        this.router.navigateByUrl("/orders");
      }
    }, error => {
      console.log("order not placed. an error occured");
      console.log(error);
    });
  }

  ngOnDestroy() {
    if(!this.checkingOut) {
      const orderItems: OrderItem[] = this.order.orderItemDtos.map((item) => {
        return new OrderItem(item.quantity, item.productName);
      });
      this.productService.addBackUnitsInStock(orderItems);
      console.log("stocks added back");
    }
  }

}
