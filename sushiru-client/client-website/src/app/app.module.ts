import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProductService } from './services/product.service';
import { MenuItemsComponent } from './components/menu/menu-items/menu-items.component';

import {CardModule} from 'primeng/card';
import {InputNumberModule} from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/shopping-cart/checkout/checkout.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AccountComponent } from './components/account/account.component';
import { FooterComponent } from './components/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    MenuItemsComponent,
    AuthenticationComponent,
    LoginComponent,
    SignupComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    AccountComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    CardModule,
    InputNumberModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
