import { NgModule }            from '@angular/core';
import { FormsModule,
         ReactiveFormsModule } from '@angular/forms';
import { CommonModule }        from '@angular/common';

import { ErrorLabelComponent } from './error-label.component';
import { InputFieldComponent } from './input-field.component';
import { PageHeaderComponent } from './page-header/page-header.component';

import { ManagementService } from './management.service';
import { ErrorMessagesPipe }   from './error-messages.pipe';
import { ToastrComponent }     from './toastr/toastr.component';
import {
  ToastModule,
  ToastOptions }               from 'ng2-toastr/ng2-toastr';
import { LaddaModule }         from 'angular2-ladda';
import { TooltipModule }       from 'ngx-tooltip';
import { BsModalModule }       from "ng2-bs3-modal";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TextMaskModule }      from 'angular2-text-mask';
import { DatePipe }            from '@angular/common';
import { DataTablesModule }     from 'angular-datatables';
import { CustomersInDebtComponent } from './customers-in-debt/customers-in-debt.component';
import { ChartsModule } from 'ng2-charts';
import {TranslateModule} from '@ngx-translate/core';
import { ReturnPipe } from '../order/return-order/return-order.component';
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { VndPipe } from './vnd.pipe';
import { NgxPaginationModule } from "ngx-pagination";
import { PipeSearchPipe } from './pipes/pipe-search.pipe';
import { ClickOutsideModule } from "ng-click-outside";
import { RoundVndPipe } from './pipes/round-vnd.pipe';

export class CustomOption extends ToastOptions {
  animate = 'flyRight'; // you can pass any options to override defaults
  newestOnTop = false;
  showCloseButton = true;
  dismiss = 'auto';
  timeOut = 2000;
  positionClass = 'toast-top-right';
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    ErrorLabelComponent,
    ErrorMessagesPipe,
    ToastrComponent,
    InputFieldComponent,
    PageHeaderComponent,
    CustomersInDebtComponent,
    ReturnPipe,
    VndPipe,
    PipeSearchPipe,
    RoundVndPipe
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    LaddaModule.forRoot({
      style: "slide-left"
    }),
    ToastModule.forRoot(),
    TooltipModule,
    Ng2SearchPipeModule,
    BsModalModule,
    TextMaskModule,
    DataTablesModule,
    ChartsModule,
    TranslateModule,
    DataTablesModule,
    PerfectScrollbarModule,
    NgxPaginationModule,
    ClickOutsideModule
  ],
  exports: [
    InputFieldComponent,
    ErrorLabelComponent,
    PageHeaderComponent,
    CustomersInDebtComponent,
    ToastrComponent,
    LaddaModule,
    TooltipModule,
    BsModalModule,
    Ng2SearchPipeModule,
    TextMaskModule,
    TranslateModule,
    DataTablesModule,
    PerfectScrollbarModule,
    VndPipe,
    NgxPaginationModule,
    PipeSearchPipe,
    ClickOutsideModule,
    RoundVndPipe
  ],
  providers: [
    ManagementService,
    { provide: ToastOptions, useClass: CustomOption },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule {}
