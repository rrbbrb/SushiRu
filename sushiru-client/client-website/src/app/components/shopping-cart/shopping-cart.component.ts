import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Address } from 'src/app/common/address';
import { CartItem } from 'src/app/common/cart-item';
import { CartItemPayload } from 'src/app/common/cart-item-payload';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { ProductDto } from 'src/app/common/product';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  private price: number = 40;
  cart: CartItemPayload[];
  cartUnavailable: CartItemPayload[];
  deliveryCost: number = 40;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private router: Router,
    private checkoutService: CheckoutService,
    private accountService: AccountService,
    private productService: ProductService
  ) {
    this.cart = [];
    this.cartUnavailable = [];
  }

  ngOnInit(): void {
    if (this.authenticated()) {
      //get cart from database
      this.getCart('onInit()');
    } else {
      //get cart from local storage
      const localCart = this.shoppingCartService.getLocalCart();
      if (localCart != null) {
        this.distributeToTwoCarts(localCart, 'onInit()');
        this.injectLatestQuantity();
      }
    }
  }

  authenticated() {
    return this.authService.isAuthenticated();
  }

  deleteCartItem(productName: string) {
    if (this.authenticated()) {
      //delete from database
      this.shoppingCartService.deleteCartItem(productName).subscribe((data) => {
        if (data) {
          this.distributeToTwoCarts(data, 'deleteCartItem()');
          this.injectLatestQuantity();
          console.log(`${productName} deleted`);
        } else {
          console.log(`${productName} not deleted`);
        }
      });
    } else {
      //delete from local storage
      const remainingItems: CartItemPayload[] = this.shoppingCartService.deleteLocalItem(
        productName
      );
      if (remainingItems !== null) {
        this.distributeToTwoCarts(remainingItems, 'deleteCartItem()');
        this.injectLatestQuantity();
        console.log(`${productName} deleted`);
      } else {
        console.log(`${productName} not deleted`);
      }
    }
  }

  updateQuantity(event: any, productName: string) {
    const quantity = event.target.value;
    this.updateCartItemQuantity(
      productName,
      +quantity,
      'update quantity method'
    );
  }

  getQuantityBounds(productDto: ProductDto, quantity: number): number[] {
    const max = productDto.unitsInStock > 20 ? 20 : productDto.unitsInStock;
    var numberArray: number[] = [];
    for (let i = 1; i <= max; i++) {
      numberArray.push(i);
    }
    // if(quantity > numberArray[numberArray.length-1]) {
    //   this.updateCartItemQuantity(productDto.productName, numberArray[numberArray.length-1], "quantity bounds method");
    // }
    return numberArray;
  }

  calculateTotalQuantity() {
    var sum = 0;
    this.cart.forEach((item) => {
      sum += +item.quantity;
    });
    return sum;
  }

  calculateSubtotal(quantity: number) {
    return this.price * quantity;
  }

  calculateTotalAmount() {
    var sum = 0;
    this.cart.forEach((item) => {
      sum += item.quantity * this.price;
    });
    return sum;
  }

  calculateTotal() {
    return this.deliveryCost + this.calculateTotalAmount();
  }

  checkout() {
    if (this.authenticated()) {
      const cartItemDtos = this.cart.map((dto) => {
        return this.shoppingCartService.mapFromPayloadToDto(dto);
      });
      console.log(`cartItemDtos are: ${JSON.stringify(cartItemDtos)}`);
      this.productService.decreaseUnitsInStock(cartItemDtos).subscribe(
        (data) => {
          const modifiedItems = data['cartChanges'];
          const decreasedStocks = data['stockChanges'];
          console.log(`modified items are: ${JSON.stringify(modifiedItems)}`);
          console.log(
            `decreased stocks are: ${JSON.stringify(decreasedStocks)}`
          );
          if (modifiedItems.length > 0) {
            // some or all products don't have sufficient stock
            console.log("products' stock decreased");
            console.log(modifiedItems);
            this.getCart('checkOut()');
            if (this.cart.length > 0) {
              // there are still items in cart after modification
              if (
                window.confirm(
                  'Quantities of the following items have been udpated due to insufficient stock. ' +
                    'Do you want to proceed to checkout?'
                )
              ) {
                this.injectOrderToCheckout(decreasedStocks); // user wants to pay now
                this.router.navigateByUrl('/checkout');
              } else {
                // user wants to continue shopping
                this.productService
                  .addBackUnitsInStock(decreasedStocks)
                  .subscribe(
                    (success) => {
                      if (success) {
                        this.getCart('checkOut() added back');
                        console.log("products' stock added back");
                      } else {
                        console.log("products' stock not added back");
                      }
                    },
                    (error) => {
                      console.log(
                        "products' stock not added back - error encountered"
                      );
                      console.log(error);
                    }
                  );
              }
            } else {
              // there are no items in cart after modification
              window.alert(
                'Due to insufficient stock, all your items are not available'
              );
            }
          } else {
            // there is sufficient stock
            this.injectOrderToCheckout(decreasedStocks);
            this.router.navigateByUrl('/checkout');
            console.log("products' stock not decreased");
          }
        },
        (error) => {
          console.log("products' stock not decreased - error encountered");
          console.log(error);
        }
      );
    } else {
      this.router.navigateByUrl("/auth/user/login");
    }
  }

  injectOrderToCheckout(decreasedStocks: CartItem[]) {
    var deliveryAddress: Address = new Address();
    this.accountService.currentUserAddress.subscribe(
      (data) => (deliveryAddress = data)
    );
    const orderItems: OrderItem[] = decreasedStocks.map((item) => {
      return new OrderItem(item.quantity, item.productName);
    });
    const order: Order = {
      id: 0,
      dateCreated: new Date(),
      lastUpdated: new Date(),
      orderStatusName: '',
      totalQuantity: this.calculateTotalQuantity(),
      totalAmount: this.calculateTotal(),
      paymentMethod: '',
      paymentStatusName: '',
      addressDto: deliveryAddress,
      orderItemDtos: orderItems,
    };
    this.checkoutService.injectOrder(order);
    console.log(`order injected: ${JSON.stringify(order)}`);

    this.shoppingCartService.clearCart(decreasedStocks).subscribe(
      (data) => {
        console.log(`cart cleared?: ${data}`);
        this.getCart('injectOrderToCheckout()');
      },
      (error) => {
        console.log('cart not cleared. an error occured');
        console.log(error);
      }
    );
  }

  // HELPER METHODS

  updateCartItemQuantity(
    productName: string,
    quantity: number,
    logKeyword: string
  ) {
    if (this.authenticated()) {
      //update from database
      this.shoppingCartService
        .updateCartItem(new CartItem(quantity, productName))
        .subscribe((data) => {
          if (data !== null) {
            this.distributeToTwoCarts(data, 'updateCartItemQuantity()');
            this.injectLatestQuantity();
            console.log(`${productName} udpated on database`);
            console.log(
              `cart is updated in ${logKeyword}: ${JSON.stringify(this.cart)}`
            );
          } else {
            console.log(`${productName} not udpated on database`);
          }
        });
    } else {
      //update from local storage
      const updatedItems: CartItemPayload[] = this.shoppingCartService.updateLocalItem(
        productName,
        quantity
      );
      if (updatedItems != null) {
        this.distributeToTwoCarts(updatedItems, 'updateCartItemQuantity()');
        this.injectLatestQuantity();
        console.log(`${productName} udpated locally`);
        console.log(
          `cart is updated in ${logKeyword}: ${JSON.stringify(this.cart)}`
        );
      } else {
        console.log(`${productName} not udpated on locally`);
      }
    }
  }

  injectLatestQuantity() {
    this.shoppingCartService.injectQuanity(this.calculateTotalQuantity());
  }

  distributeToTwoCarts(data: CartItemPayload[], logKeyword: string) {
    this.cart = data.filter((item) => item.productDto.enabled);
    this.cartUnavailable = data.filter((item) => !item.productDto.enabled);
    console.log(`get cart called at ${logKeyword}`);
    console.log(`cart = ${JSON.stringify(this.cart)}`);
    console.log(`cartUnavailable = ${JSON.stringify(this.cartUnavailable)}`);
  }

  getCart(logKeyword: string) {
    this.shoppingCartService.getCart().subscribe((updatedCart) => {
      this.distributeToTwoCarts(updatedCart, logKeyword);
      this.injectLatestQuantity();
    });
  }
}
