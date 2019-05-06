import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA, PipeTransform, Pipe } from '@angular/core';
import { HttpModule }   from '@angular/http';
import { By }           from '@angular/platform-browser';
import { FormBuilder }  from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable }         from 'rxjs/Rx';

import {
  click, advance
} from '../../../testing';

import { OrderHistoryComponent } from './order-history.component';
import { Product }           from '../product.model';
import { Order }              from '../order.model';
import { OrderItem }         from '../order-item';
import { Customer }         from '../../customer/customer.model';
import { ModalComponent }       from 'ng2-bs3-modal/ng2-bs3-modal';
import { OrderService }         from '../order.service';
import { ToastrService }        from '../../shared/toastr.service';
import * as _ from 'lodash';

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
const ORDER_ITEMS: OrderItem[] = [
  new OrderItem(1, 2, 123, 0.02),
  new OrderItem(2, 1, 163, 0)
]
const PRODUCTS: Product[] = [
  new Product(1, 'laptop', 'ASUS', 'MX-123', 1000, 1200),
  new Product(2, 'phone',  'DELL', 'MX-124', 1000, 1200),
  new Product(3, 'TV', 'XIAOMI', 'MX-125', 1000, 1200),
  new Product(4, 'Table', 'Apple', 'MX-126', 1000, 1200)
];
const RATES: number[] = [0, 0.02, 0.1, 0.3];

const ORDERS: Order[] = [
  new Order('E66DD3', 999, '1/1/2017', CUSTOMERS[0], ORDER_ITEMS),
  new Order('PB093H', 254, '2/2/2017', CUSTOMERS[1], ORDER_ITEMS),
];
class OrderServiceSpy{
  orders = ORDERS;
  getOrders = jasmine.createSpy('getOrders')
                .and.returnValue(Observable.of(this.orders));
  payDebt = jasmine.createSpy('payDebt')
                .and.returnValue(Observable.of(this.orders));
}

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;
  let toastrStub: ToastrService;
  let orderStub: OrderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      declarations: [ OrderHistoryComponent, TranslatePipeMock ],
      providers: [ FormBuilder, DatePipe ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(OrderHistoryComponent, {
      set: {
        providers: [
          { provide: ToastrService, useClass: ToastrServiceSpy },
          { provide: OrderService, useClass: OrderServiceSpy },
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    toastrStub = fixture.debugElement.injector.get(ToastrService);
    orderStub = fixture.debugElement.injector.get(OrderService);
    component.dtTrigger.complete();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load orders from the server', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.orders).toBe(ORDERS);
  }));

  it('should get order detail when click', fakeAsync(() => {
    fixture.detectChanges();
    const listHtml = fixture.debugElement.query(By.css('.list-orders'));
    listHtml.triggerEventHandler('click', null);
    expect(component.customerSelected.name).toBe(CUSTOMERS[0].name);
    expect(component.orderItems).toBe(ORDER_ITEMS);
  }));

  it('should print order when click print button', fakeAsync(() => {
    fixture.detectChanges();
    spyOn(component, 'print');
    const listHtml = fixture.debugElement.query(By.css('.print-btn'));
    listHtml.triggerEventHandler('click', null);
    expect(component.print).toHaveBeenCalled();
  }));

  it('should pay debt when click button', fakeAsync(() => {
    // const spySuccess = spyOn(orderStub, 'payDebt');
    fixture.detectChanges();
    component.order_detail = ORDERS[0];
    const clickPay = fixture.debugElement.query(By.css('.pay-btn'));
    clickPay.triggerEventHandler('click', null);
    fixture.detectChanges();
    console.log(clickPay);
    expect(clickPay);
    expect(orderStub.payDebt).toHaveBeenCalled();
  }));
});
