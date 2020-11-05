import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { ProductDto } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.css'],
})
export class MenuItemsComponent implements OnInit {
  products: ProductDto[];
  productsDisabled: ProductDto[];
  currentCategoryId: number;

  constructor(private productService: ProductService, private route: ActivatedRoute, 
    private shoppingCartService: ShoppingCartService, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    if(this.authenticated()) {
      this.shoppingCartService.getQuantity().subscribe((quantity) =>
          this.shoppingCartService.injectQuanity(quantity)
      );      
    } else {
      this.shoppingCartService.injectQuanity(this.shoppingCartService.getLocalQuantity());
    }
  }

  authenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  listProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.productService
        .getProductsByCategory(this.currentCategoryId)
        .subscribe((data) => {
          this.products = data.filter(product => product.enabled);
          this.productsDisabled = data.filter(product => !product.enabled);
          console.log(`fetched ${this.products.length} products enabled, ${this.productsDisabled.length} products disabled`);
        });
    } else {
      this.currentCategoryId = 1;
    }
  }

  addToCart(product: ProductDto) {
    var inputValue = (<HTMLInputElement>(
      document.getElementById(product.productName)
    )).value;
    var cartItem: CartItem = new CartItem(+inputValue, product.productName);
    if (this.authenticated()) {
      // add to cart in database
      this.shoppingCartService.addCartItem(cartItem).subscribe((data) => {
        if (data) {
          var oldQuantity = 0;
          this.shoppingCartService.currentQuantity.subscribe((quantity) => {
            oldQuantity = quantity;
          });
          this.shoppingCartService.injectQuanity(oldQuantity + +inputValue);
          console.log(`Added ${inputValue} ${product.productName} to cart`);
        } else {
          console.log(`${inputValue} ${product.productName} not added to cart`);
        }
      });
    } else {
      // add to local cart
      if (this.shoppingCartService.hasLocalCart()) {
        this.shoppingCartService.addToLocalCart(+inputValue, product);
      } else {
        this.shoppingCartService.addToNewLocalCart(+inputValue, product);
      }
      var oldQuantity = 0;
      this.shoppingCartService.currentQuantity.subscribe((quantity) => {
        oldQuantity = quantity;
      });
      this.shoppingCartService.injectQuanity(oldQuantity + +inputValue);
    }
  }
}
