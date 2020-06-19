import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuItemsComponent } from './components/menu/menu-items/menu-items.component';

const appRoutes: Routes = [
    { path: 'products', component: MenuItemsComponent },
    { path: 'product-categories/:id', component: MenuItemsComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full'},
    { path: '**', redirectTo: '/products', pathMatch: 'full'}
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