import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA, PipeTransform, Pipe } from '@angular/core';
import { HttpModule }   from '@angular/http';
import { By }           from '@angular/platform-browser';
import { FormBuilder }  from '@angular/forms';

import {
  click, advance
} from '../../../testing';

import { NewOrderComponent } from './new-order.component';
import { CustomerService }   from '../../customer/customer.service';
import { OrderService }      from '../order.service';
import { QuotService } from '../../core/quot.service';
import { ToastrService }     from '../../shared/toastr.service';
import { Customer }          from '../../customer/customer.model';
import { OrderItem }         from '../order-item';
import { Product }           from '../product.model';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DataTablesModule }   from 'angular-datatables';
import { Observable }         from 'rxjs/Rx';
import * as _ from 'lodash';
import { Ng2Bs3ModalModule, ModalComponent }   from 'ng2-bs3-modal/ng2-bs3-modal';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Pipe({
  name: 'translate'
})
class TranslatePipeMock implements PipeTransform {
  public name: string = 'translate';
  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

class ToastrServiceSpy {
  SetMessageWarning() {
    // console.log('enter warning');
  }
  SetMessageSuccess() { }
};

const CUSTOMERS: Customer[] = [
  new Customer({id: 1,
                name: 'Thuan',
                email: 'thuan@gmail.com',
                phone: '0989666999',
                address: 'DH'}),
  new Customer({id: 2,
                name: 'Binh',
                email: 'binh@gmail.com',
                phone: '0989777999',
                address: 'QB'}),
];
class CustomerServiceSpy {
  customers = CUSTOMERS;
  getCustomersWithObservable = jasmine.createSpy('getCustomersWithObservable')
                        .and.returnValue(Observable.of(this.customers));
}

const PRODUCTS: Product[] = [
  new Product(1, 'laptop', 'ASUS', 'MX-123', 1000, 1200),
  new Product(2, 'phone',  'DELL', 'MX-124', 1000, 1200),
  new Product(3, 'TV', 'XIAOMI', 'MX-125', 1000, 1200),
  new Product(4, 'Table', 'Apple', 'MX-126', 1000, 1200)
];
const RATES: number[] = [0, 0.02, 0.1, 0.3];
class OrderServiceSpy{
  products = PRODUCTS;
  rates = RATES;
  getProducts = jasmine.createSpy('getProducts')
                .and.returnValue(Observable.of(this.products));
  getDiscountedRates = jasmine.createSpy('getDiscountedRates')
                      .and.returnValue(Observable.of(this.rates));
  addOrder = jasmine.createSpy('addOrder')
             .and.returnValue(Observable.of(1));
}

class QuotServiceSpy {

}

fdescribe('NewOrderComponent', () => {
  let component: NewOrderComponent;
  let fixture: ComponentFixture<NewOrderComponent>;
  let toastrStub: ToastrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DataTablesModule, HttpModule, Ng2Bs3ModalModule, Ng2SearchPipeModule ],
      declarations: [ NewOrderComponent, TranslatePipeMock ],
      providers: [ FormBuilder ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(NewOrderComponent, {
      set: {
        providers: [
          { provide: CustomerService, useClass: CustomerServiceSpy },
          { provide: ToastrService, useClass: ToastrServiceSpy },
          { provide: OrderService, useClass: OrderServiceSpy },
          { provide: QuotService, useClass: QuotServiceSpy },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderComponent);
    component = fixture.componentInstance;
    toastrStub = fixture.debugElement.injector.get(ToastrService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load products & customer from the server', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.products).toBe(PRODUCTS);
    expect(component.customers).toBe(CUSTOMERS);
    // expect(component.rates).toBe(RATES);
  }));

  it('should select customer when termUser was typed and clicked anyone', fakeAsync(() => {
    fixture.detectChanges();
    component.termUser = 'Thuan';
    fixture.detectChanges();
    const listHtml = fixture.debugElement.queryAll(By.css('.list-customers'))
              .map(each => each.nativeElement.innerText);
    expect(listHtml.toString()).toContain('Thuan');
    expect(component.customerSelected).not.toBeDefined();
    const click = fixture.debugElement.query(By.css('.list-customers'));
    click.triggerEventHandler('click', null);
    expect(component.customerSelected).toBeDefined();
  }));

  it('should select product when term was typed and clicked anyone then remove', fakeAsync(() => {
    fixture.detectChanges();
    component.term = 'MX-12';
    fixture.detectChanges();
    const listHtml = fixture.debugElement.queryAll(By.css('.list-products'))
              .map(each => each.nativeElement.innerText);
    expect(listHtml.length).toBe(4);

    const click = fixture.debugElement.query(By.css('.list-products'));
    click.triggerEventHandler('click', null);
    expect(component.productsSelected.length).toBe(1);

    fixture.detectChanges();
    const clickRemove = fixture.debugElement.query(By.css('.remove'));
    clickRemove.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.productsSelected.length).toBe(0);
  }));

  it('should warning when  customer not selected yet',
    fakeAsync(() => {
      const spyWarning = spyOn(toastrStub, 'SetMessageWarning');
      const click = fixture.debugElement.query(By.css('.add-order'));
      click.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(spyWarning);
      expect(spyWarning).toHaveBeenCalledWith('Please select customer');
  }));
  it('should add order', fakeAsync(() => {
    const spySuccess = spyOn(toastrStub, 'SetMessageSuccess');
    component.customerSelected = CUSTOMERS[0];
    component.productsSelected.unshift(PRODUCTS[0]);
    const click = fixture.debugElement.query(By.css('.add-order'));
    click.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(spySuccess).toHaveBeenCalledWith('Created order');
    expect(component.customerSelected).toBeNull();
    expect(component.productsSelected.length).toBe(0);
  }));

});
