import { BrowserModule }        from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  APP_BASE_HREF,
  LocationStrategy,
  HashLocationStrategy,
  PathLocationStrategy }        from '@angular/common';
import { HttpModule }           from '@angular/http';
import { Angular2TokenService } from 'angular2-token';
import { AppRoutingModule }     from './app-routing.module';
import {
  FormsModule,
  ReactiveFormsModule }         from '@angular/forms';
import { SharedModule }         from './shared/shared.module';
import { CoreModule }           from './core/core.module';

import { AppComponent }         from './app.component';
import { NavbarComponent }      from './layout/navbar/navbar.component';
import { FooterComponent }      from './layout/footer/footer.component';
import { SidebarComponent }     from './layout/sidebar/sidebar.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { LoginComponent }       from './auth/login/login.component';

import { CustomerComponent }    from './customer/customer.component';
import { DataTablesModule }     from 'angular-datatables';
import { ProductsComponent }    from './products/products.component';

import { StorageComponent }     from './storage/storage.component';
import { OrderHistoryComponent } from './order/order-history/order-history.component';
import { StoreComponent }       from './store/store.component';
import { NewOrderComponent }    from './order/new-order/new-order.component';
import { RateComponent }        from './rate/rate.component';
import { ChartsModule }         from 'ng2-charts';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader}    from '@ngx-translate/http-loader';
import { VndPipe } from './shared/vnd.pipe';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { CategoryDiscountComponent } from './category-discount/category-discount.component';
import { InventoryStatisticComponent } from './inventory-statistic/inventory-statistic.component';
import { ProductsBestSellerComponent } from './products-best-seller/products-best-seller.component';
import { StatisticComponent } from './statistic/statistic.component';
// import { BsModalModule } from "ng2-bs3-modal";


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    CustomerComponent,
    ProductsComponent,
    StorageComponent,
    StoreComponent,
    OrderHistoryComponent,
    NewOrderComponent,
    RateComponent,
    CategoryDiscountComponent,
    InventoryStatisticComponent,
    ProductsBestSellerComponent,
    StatisticComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LoadingBarHttpModule,
    CoreModule,
    ChartsModule,
    HttpClientModule,
      TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    // { provide: APP_BASE_HREF, useValue: '/'},
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
