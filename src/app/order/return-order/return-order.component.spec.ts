import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from "@angular/core/testing";
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  PipeTransform,
  Pipe
} from "@angular/core";
import { Observable } from "rxjs/Rx";
import * as _ from "lodash";
import { By } from "@angular/platform-browser";
import { FormBuilder } from "@angular/forms";
import { ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { click, advance } from "../../../testing";
import { ReturnOrderComponent } from './return-order.component';

import { OrderService, Order, OrderItem, Product} from '../';
import { Customer } from "../../customer/customer.model";
import { ToastrService } from "../../shared/toastr.service";
import { Ng2SearchPipeModule } from "ng2-search-filter";


@Pipe({
  name: "translate"
})
class TranslatePipeMock implements PipeTransform {
  public name: string = "translate";
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
  new Customer({
    id: 1,
    name: "Thuan",
    email: "thuan@gmail.com",
    phone: "0989666999",
    address: "DH"
  }),
  new Customer({
    id: 2,
    name: "Binh",
    email: "binh@gmail.com",
    phone: "0989777999",
    address: "QB"
  })
];
const ORDER_ITEMS: OrderItem[] = [
  new OrderItem(1, 2, 123, 0.02),
  new OrderItem(2, 1, 163, 0)
];
const PRODUCTS: Product[] = [
  new Product(1, "laptop", "ASUS", "MX-123", 1000, 1200),
  new Product(2, "phone", "DELL", "MX-124", 1000, 1200),
  new Product(3, "TV", "XIAOMI", "MX-125", 1000, 1200),
  new Product(4, "Table", "Apple", "MX-126", 1000, 1200)
];
const RATES: number[] = [0, 0.02, 0.1, 0.3];

const ORDERS: Order[] = [
  new Order("E66DD3", 999, "1/1/2017", CUSTOMERS[0], ORDER_ITEMS),
  new Order("PB093H", 254, "2/2/2017", CUSTOMERS[1], ORDER_ITEMS)
];

class OrderServiceSpy {
  orders = ORDERS;
  getSearchOrder = jasmine
    .createSpy("getSearchOrder")
    .and.returnValue(Observable.of(this.orders));
  getOrder = jasmine
    .createSpy("getOrder")
    .and.returnValue(Observable.of(this.orders[0]));
}

describe('ReturnOrderComponent', () => {
  let component: ReturnOrderComponent;
  let fixture: ComponentFixture<ReturnOrderComponent>;
  let ordersStub: OrderServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [Ng2SearchPipeModule],
      declarations: [ ReturnOrderComponent, ModalComponent, TranslatePipeMock ],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(ReturnOrderComponent, {
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
    fixture = TestBed.createComponent(ReturnOrderComponent);
    component = fixture.componentInstance;
    ordersStub = fixture.debugElement.injector.get(OrderService) as any;
    fixture.detectChanges();
  });

  describe('Choose first order to return invoice', () => {
    beforeEach(() => {
      let firstOrder = _.first(ORDERS);
      component.selectOrder(firstOrder.id);
    });

    it('should toogle loading and term = "" ', () => {
      expect(component.term).toBe('');
    });

    it('should call get order by id from order service', () => {
      expect(ordersStub.getOrder.calls.count()).toBe(1);
    });


  });

  
});
