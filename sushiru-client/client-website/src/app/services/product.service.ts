import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductDto } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { Observable } from 'rxjs';
import { CartItemPayload } from '../common/cart-item-payload';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productURL = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getProductsByCategory(categoryId: number): Observable<ProductDto[]> {
    return this.httpClient.get<ProductDto[]>(`${this.productURL}/category/${categoryId}`);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(`${this.productURL}/categories`);
  }
  
  decreaseUnitsInStock(cartItems: CartItem[]): Observable<any> {
    return this.httpClient.put<Map<string, CartItem[]>>(`${this.productURL}/decrease-units`, cartItems);
  }

  addBackUnitsInStock(cartItems: CartItem[]): Observable<any> {
    return this.httpClient.put<boolean>(`${this.productURL}/add-back`, cartItems);
  }
}