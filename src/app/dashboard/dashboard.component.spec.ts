import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, PipeTransform, Pipe, Directive } from '@angular/core';
import { DataTablesModule }   from 'angular-datatables';
import { HttpModule, Response, ResponseOptions }   from '@angular/http';
import { Angular2TokenService }  from 'angular2-token';
import { CustomerService } from '../customer/customer.service';
import { OrderService } from '../order/order.service';
import { ToastrService } from '../shared/toastr.service';
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { DashboardService } from './dashboard.service';

import { DashboardComponent } from './dashboard.component';
// import { CustomersInDebtComponent } from '../shared/customers-in-debt/customers-in-debt.component';
import { ChartsModule } from 'ng2-charts';

@Pipe({
  name: 'translate'
})
class TranslatePipeMock implements PipeTransform {
  public name = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

@Directive({
  selector: 'list-customers-in-debt'
})
class CustomersInDebtComponentDirective {}
const resGet = `{"result":
                  [{"imported_price":
                      [
                      {"month":"2016-11-01 00:00:00+00","total":22111.0},
                      {"month":"2016-12-01 00:00:00+00","total":28680.0},
                      {"month":"2017-01-01 00:00:00+00","total":22235.0},
                      {"month":"2017-02-01 00:00:00+00","total":28399.0},
                      {"month":"2017-03-01 00:00:00+00","total":23226.0},
                      {"month":"2017-04-01 00:00:00+00","total":20970.0},
                      {"month":"2017-05-01 00:00:00+00","total":40125.0},
                      {"month":"2017-06-01 00:00:00+00","total":23245.0},
                      {"month":"2017-07-01 00:00:00+00","total":22865.0},
                      {"month":"2017-08-01 00:00:00+00","total":10200.0},
                      {"month":"2017-09-01 00:00:00+00","total":18440.0},
                      {"month":"2017-10-01 00:00:00+00","total":24867.0}]},
                  {"total_amount":
                      [
                      {"month":"2016-11-01 00:00:00+00","total":29754.4},
                      {"month":"2016-12-01 00:00:00+00","total":39821.0},
                      {"month":"2017-01-01 00:00:00+00","total":35484.6},
                      {"month":"2017-02-01 00:00:00+00","total":36556.0},
                      {"month":"2017-03-01 00:00:00+00","total":31391.5},
                      {"month":"2017-04-01 00:00:00+00","total":21143.7},
                      {"month":"2017-05-01 00:00:00+00","total":28721.0},
                      {"month":"2017-06-01 00:00:00+00","total":30248.0},
                      {"month":"2017-07-01 00:00:00+00","total":41273.8},
                      {"month":"2017-08-01 00:00:00+00","total":16960.2},
                      {"month":"2017-09-01 00:00:00+00","total":26122.8},
                      {"month":"2017-10-01 00:00:00+00","total":33398.5}]},
                  {"profit":
                      [
                      {"month":"2016-11","total":7643.4000000000015},
                      {"month":"2016-12","total":11141.0},
                      {"month":"2017-01","total":13249.599999999999},
                      {"month":"2017-02","total":8157.0},
                      {"month":"2017-03","total":8165.5},
                      {"month":"2017-04","total":173.70000000000073},
                      {"month":"2017-05","total":-11404.0},
                      {"month":"2017-06","total":7003.0},
                      {"month":"2017-07","total":18408.800000000003},
                      {"month":"2017-08","total":6760.200000000001},
                      {"month":"2017-09","total":7682.799999999999},
                      {"month":"2017-10","total":8531.5}]},
                  {"inventory":
                      [{"total":69619.0}]},
                  {"expected":
                      [{"total":75337.0}]}
                  ]}`;
const options = new ResponseOptions({
  body: resGet,
  status: 200,
  statusText: 'Ok'
});
const res = new Response(options);
class DashboardServiceSpy {
    getResults = jasmine.createSpy('getProducts')
                        .and.returnValue(Promise.resolve(res));
  }

xdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DataTablesModule, HttpModule, ChartsModule ],
      declarations: [ DashboardComponent, CustomersInDebtComponentDirective, TranslatePipeMock ],
      providers: [ Angular2TokenService,
                  CustomerService,
                  OrderService,
                  ToastrService, ToastsManager, ToastOptions ],
      schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
    })
    .overrideComponent(DashboardComponent, {
      set: {
        providers: [
          { provide: DashboardService, useClass: DashboardServiceSpy }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be load results from server', fakeAsync(() => {
    // component.getResult();
    tick();
    fixture.detectChanges();
    expect(component.profit).toBeDefined();
  }));
});
