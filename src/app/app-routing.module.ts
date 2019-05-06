import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementGuard,
         LoggedInGuard }        from './guard/';

import { LoginComponent }       from './auth/login/login.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { CustomerComponent }    from './customer/customer.component';
import { ProductsComponent }     from './products/products.component';
import { OrderHistoryComponent }     from './order/order-history/order-history.component';
import { StorageComponent }     from './storage/storage.component';
import { StoreComponent}        from './store/store.component';
import { NewOrderComponent }    from './order/new-order/new-order.component';
import { RateComponent } from "./rate/rate.component";
import { CategoryDiscountComponent } from './category-discount/category-discount.component'
import { ReturnOrderComponent } from './order/return-order/return-order.component';
const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [LoggedInGuard, ManagementGuard]
  },
  {
    path: "customers",
    component: CustomerComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "products",
    component: ProductsComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "import-product",
    component: StorageComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "storage",
    component: StoreComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "order-history",
    component: OrderHistoryComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "new-order",
    component: NewOrderComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "discount-rate",
    component: RateComponent,
    canActivate: [LoggedInGuard, ManagementGuard]
  },
  {
    path: "categoryDiscount",
    component: CategoryDiscountComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "return-order",
    loadChildren: "./order/return-order/return-order.module#ReturnOrderModule",
    canLoad: [LoggedInGuard, ManagementGuard]
  },
  {
    path: "users",
    loadChildren: "./users/users.module#UsersModule",
    canLoad: [ManagementGuard]
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
