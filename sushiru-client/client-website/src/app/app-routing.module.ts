import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItemsComponent } from './components/menu/menu-items/menu-items.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/shopping-cart/checkout/checkout.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AccountComponent } from './components/account/account.component';
import { SignUpSuccessComponent } from './components/authentication/sign-up-success/sign-up-success.component';

const appRoutes: Routes = [
    { path: 'menu', component: MenuComponent, children: [
        { path: 'category', redirectTo: '/menu/category/1', pathMatch: 'full' },
        { path: 'category/:id', component: MenuItemsComponent }
    ] },
    { path: 'auth', component: AuthenticationComponent, children: [
        { path: 'user', redirectTo: '/auth/user/login', pathMatch: 'full' },
        { path: 'user/login', component: LoginComponent },
        { path: 'user/signup', component: SignupComponent }
    ] },
    { path: 'signup-success', component: SignUpSuccessComponent },
    { path: 'cart', component: ShoppingCartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'orders', component: OrderHistoryComponent },
    { path: 'account', component: AccountComponent },
    { path: '', redirectTo: 'menu/category', pathMatch: 'full'},
    { path: '**', redirectTo: 'menu/category', pathMatch: 'full'}
]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}