import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProductService } from './services/product.service';
import { BannerComponent } from './components/banner/banner.component';
import { MenuItemsComponent } from './components/menu/menu-items/menu-items.component';

import {CardModule} from 'primeng/card';
import {InputNumberModule} from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    BannerComponent,
    MenuItemsComponent
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
