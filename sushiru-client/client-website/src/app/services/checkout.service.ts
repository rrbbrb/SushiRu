import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../common/order';
import { OrderItem } from '../common/order-item';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private orderToPlace = new BehaviorSubject<Order>(null);
  currentOrderToPlace = this.orderToPlace.asObservable();

  private orderURL: string = 'http://localhost:8080/api/orders';

  constructor(private httpClient: HttpClient) { }

  injectOrder(order: Order) {
    this.orderToPlace.next(order);
  }

  placeOrder(order: Order): Observable<any> {
    return this.httpClient.post<boolean>(`${this.orderURL}/place-order`, order);
  }

  
}
