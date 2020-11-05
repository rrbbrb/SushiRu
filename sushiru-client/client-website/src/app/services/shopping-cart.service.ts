import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { CartItemPayload } from '../common/cart-item-payload';
import { OrderItem } from '../common/order-item';
import { ProductDto } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  initialQuantity: number = 0;
  private totalQuantity = new BehaviorSubject<number>(this.initialQuantity);
  currentQuantity = this.totalQuantity.asObservable();

  constructor(private localStorageService: LocalStorageService, private httpClient: HttpClient) { }

  private cartURL: string = 'http://localhost:8080/api/cart';

  injectQuanity(quantity: number) {
    this.totalQuantity.next(quantity);
  }

  getQuantity(): Observable<number> {
    return this.httpClient.get<number>(`${this.cartURL}/cart-quantity`);
  }

  getCart(): Observable<any> {
    return this.httpClient.get<CartItemPayload[]>(this.cartURL);
  }

  migrateCartFromLocalToDB(): Observable<any> {
    return this.httpClient.post<boolean>(`${this.cartURL}/new`, this.getLocalCartForMigration());
  }

  updateCartItem(cartItem: CartItem): Observable<any> {
    return this.httpClient.put<boolean>(`${this.cartURL}/update-item`, cartItem);
  }

  addCartItem(cartItem: CartItem): Observable<any> {
    return this.httpClient.post<boolean>(`${this.cartURL}/add-item`, cartItem);
  }

  deleteCartItem(productName: string): Observable<any> {
    return this.httpClient.delete<boolean>(`${this.cartURL}/delete-item/${productName}`);
  }

  clearCart(cartItems: CartItem[]): Observable<any> {
    return this.httpClient.put<boolean>(`${this.cartURL}/clear`, cartItems);
  }

  getLocalQuantity(): number {
    const localItems: CartItemPayload[] = JSON.parse(this.localStorageService.retrieve('localCart'));
    var sum = 0;
    if(localItems != null) {
      localItems.forEach( item => {
        sum += item.quantity;
      });
    }
    return sum;
  }

  hasLocalCart(): boolean {
    return this.localStorageService.retrieve('localCart') != null;
  }

  getLocalCart(): CartItemPayload[] {
    return JSON.parse(this.localStorageService.retrieve('localCart'));
  }

  getLocalCartForMigration(): CartItem[] {
    const cartItems = [];
    this.getLocalCart().forEach( item => {
      cartItems.push(new CartItem(item.quantity, item.productDto.productName));
    })
    console.log("cart to migrate:" + cartItems);
    return cartItems;
  }

  addToLocalCart(quantity: number, productDto: ProductDto) {
    const localCartItems: CartItemPayload[] = JSON.parse(this.localStorageService.retrieve('localCart'));
    var exists: boolean = false;
    localCartItems.forEach( item => {
      if(item.productDto.productName == productDto.productName) {
        item.quantity += quantity;
        exists = true;
      }
    });
    if(!exists) {
      localCartItems.push(new CartItemPayload(quantity, productDto));
    };
    this.localStorageService.store('localCart', JSON.stringify(localCartItems));
  }

  addToNewLocalCart(quantity: number, productDto: ProductDto) {
    const localCartItems: CartItemPayload[] = [new CartItemPayload(quantity, productDto)];
    this.localStorageService.store('localCart', JSON.stringify(localCartItems));
  }

  deleteLocalItem(productName: string): CartItemPayload[] {
    var localCartItems: CartItemPayload[] = JSON.parse(this.localStorageService.retrieve('localCart'));
    var exists: boolean = false;
    localCartItems.forEach( item => {
      if(item.productDto.productName === productName) {
        const index: number = localCartItems.indexOf(item);
        if (index !== -1) {
            localCartItems.splice(index, 1);
        }
        this.localStorageService.store('localCart', JSON.stringify(localCartItems));        
        exists = true;
      }
    });
    if(exists) {
      return localCartItems;
    } else {
      return null;
    }
  }
  
  updateLocalItem(productName: string, quantity: number): CartItemPayload[] {
    var localCartItems: CartItemPayload[] = JSON.parse(this.localStorageService.retrieve('localCart'));
    var exists: boolean = false;
    localCartItems.forEach( item => {
      if(item.productDto.productName === productName) {
        if(quantity !== item.quantity) {
          item.quantity = quantity;
          this.localStorageService.store('localCart', JSON.stringify(localCartItems));        
          exists = true;
        }
      }
    });
    if(exists) {
      return localCartItems;
    } else {
      return null;
    }
  }

  clearLocalCart() {
    this.localStorageService.clear('localCart');
  }

  mapFromPayloadToDto(cartItemPayload: CartItemPayload): CartItem {
    return new CartItem(cartItemPayload.quantity, cartItemPayload.productDto.productName);
  }

  addBackToCart(orderItems: OrderItem[]) {
    return this.httpClient.post<boolean>(`${this.cartURL}/new`, this.getLocalCartForMigration());
  }
}
