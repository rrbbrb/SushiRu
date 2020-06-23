import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { MenuItemsComponent } from './components/menu/menu-items/menu-items.component';

const appRoutes: Routes = [
    { path: 'menu', component: MenuComponent, children: [
        { path: 'category', redirectTo: '/menu/category/1', pathMatch: 'full' },
        { path: 'category/:id', component: MenuItemsComponent }
    ] },
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