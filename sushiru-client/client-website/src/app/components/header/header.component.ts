import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  totalCartItems: number;

  constructor(private authService: AuthService, private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
    this.shoppingCartService.currentQuantity.subscribe(quantity => {
      this.totalCartItems = quantity;
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

}
