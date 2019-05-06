import { CategoryDiscountService } from './../category-discount/categoryDiscount.service';
import { NgModule }               from '@angular/core';

import { Angular2TokenService }   from 'angular2-token';

import { AuthService }            from '../auth/auth.service';
import { ProductsService }        from './products.service';
import { ManagementGuard,
         LoggedInGuard }          from '../guard/';
import { StoreService }           from '../store/store.service';
import { CustomerService }        from '../customer/customer.service';
import { OrderService }           from '../order/order.service';
import { ToastrService }          from '../shared/toastr.service';
import { TranslateService }       from '@ngx-translate/core';
import { UsersService }           from '../users/users.service';
import { QuotService }            from './quot.service';
import { Ng2SearchPipe } from "ng2-search-filter";
import { SidebarService } from '../layout/sidebar.service';

@NgModule({
  providers: [
    Angular2TokenService,
    AuthService,
    ProductsService,
    LoggedInGuard,
    ManagementGuard,
    StoreService,
    CustomerService,
    OrderService,
    ToastrService,
    TranslateService,
    UsersService,
    QuotService,
    Ng2SearchPipe,
    SidebarService,
    CategoryDiscountService
  ]
})
export class CoreModule {}
