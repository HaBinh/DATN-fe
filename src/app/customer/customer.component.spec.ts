import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  discardPeriodicTasks
} from '@angular/core/testing';
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  PipeTransform,
  Pipe
} from '@angular/core';
import { HttpModule, Response, ResponseOptions } from '@angular/http';
import { By } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';

import { click, advance } from '../../testing';

import { CustomerComponent } from './customer.component';
import { CustomerService } from './customer.service';
import { Customer } from './customer.model';
import { DataTablesModule } from 'angular-datatables';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Ng2Bs3ModalModule, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Pipe({
  name: 'translate'
})
class TranslatePipeMock implements PipeTransform {
  public name: string = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

const newCustomer = new Customer({
  id: 3,
  name: 'Minh',
  email: 'minh@gmail.com',
  phone: '0989888999',
  address: 'QT'
});
const CUSTOMERS: Customer[] = [
  new Customer({
    id: 1,
    name: 'Thuan',
    email: 'thuan@gmail.com',
    phone: '0989666999',
    address: 'DH'
  }),
  new Customer({
    id: 2,
    name: 'Binh',
    email: 'binh@gmail.com',
    phone: '0989777999',
    address: 'QB'
  })
];

// tslint:disable-next-line:max-line-length
const resGet =
  '{"customers":[{"id":1,"name":"Thuan","email":"thuan@gmail.com","phone":"0989666999","address":"DH"},{"id":2,"name":"Binh","email":"binh@gmail.com","phone":"0989777999","address":"QB"}]}';
let options = new ResponseOptions({
  body: resGet,
  status: 200,
  statusText: 'Ok'
});
const res = new Response(options);
const resAddJSON =
  '{"customer":{"id":3,"name":"Minh","email":"minh@gmail.com","phone":"0989888999","address":"QT"}}';
options = new ResponseOptions({
  body: resAddJSON,
  status: 201,
  statusText: 'Created'
});
const resAdd = new Response(options);

class CustomerServiceSpy {
  customers = CUSTOMERS;
  getCustomers = jasmine
    .createSpy('getCustomers')
    .and.returnValue(Promise.resolve(res));
  updateCustomer = jasmine
    .createSpy('updateCustomer')
    .and.callFake((customer: Customer) => {
      return Promise.resolve();
    });
  addCustomer = jasmine
    .createSpy('addCustomer')
    .and.callFake((customer: Customer) => {
      return Observable.of(newCustomer);
    });
  deleteCustomer = jasmine
    .createSpy('deleteCustomer')
    .and.callFake((customer: Customer) => {
      return Promise.resolve();
    });
}
describe('CustomerComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [DataTablesModule, HttpModule],
        declarations: [CustomerComponent, TranslatePipeMock],
        providers: [FormBuilder],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .overrideComponent(CustomerComponent, {
          set: {
            providers: [
              { provide: CustomerService, useClass: CustomerServiceSpy }
            ]
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(CustomerComponent);
          component = fixture.componentInstance;
          component.dtTrigger.complete();
        });
    })
  );

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(CustomerComponent);
  //   component = fixture.componentInstance;
  // });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should load customers from the server',
    fakeAsync(() => {
      component.getCustomers();
      tick();
      expect(_.first(component.customers).name).toBe(_.first(CUSTOMERS).name);
    })
  );

  it(
    'should render customers table after get customers from the server',
    fakeAsync(() => {
      component.getCustomers();
      tick();
      fixture.detectChanges();
      tick(); // wait to dt trigger execute but not necessary, can remove it
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('td')).nativeElement.innerText
      ).toBe(_.first(CUSTOMERS).name);
      discardPeriodicTasks();
    })
  );

  it(
    'should switch to editing when click pencil icon',
    fakeAsync(() => {
      component.getCustomers();
      tick();
      fixture.detectChanges();
      tick(); // wait to dt trigger execute but not necessary, can remove it
      fixture.detectChanges();
      const editIcon = fixture.debugElement.query(By.css('.btn-edit'));
      click(editIcon);
      expect(component.editing).not.toBe(-1);
    })
  );

  it(
    'should revert edit',
    fakeAsync(() => {
      component.revertEdit();
      expect(component.editing).toBe(-1);
    })
  );

  it(
    'should revert edit when press enter',
    fakeAsync(() => {
      component.getCustomers();
      tick();
      fixture.detectChanges();
      component.editing = 1;
      tick();
      fixture.detectChanges();
      const inputFeild = fixture.debugElement.query(By.css('.red'));
      click(inputFeild);
      expect(component.editing).toBe(-1);
    })
  );

  describe('Test update customer', () => {
    beforeEach(
      fakeAsync(() => {
        component.getCustomers();
        tick();
        fixture.detectChanges();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        // component.editCustomer(
        //   'mthuan',
        //   'thuan274@gmail.com',
        //   '0909098890',
        //   'QB',
        //   1,
        //   CUSTOMERS[0]
        // );
      })
    );

    it(
      'should update products property',
      fakeAsync(() => {
        expect(
          _.findIndex(component.customers, p => (p.name = 'mthuan'))
        ).toBeGreaterThan(-1);
        discardPeriodicTasks();
      })
    );

    it(
      'should update html',
      fakeAsync(() => {
        fixture.detectChanges();
        const html = fixture.debugElement
          .queryAll(By.css('td'))
          .map(each => each.nativeElement.innerText);
        expect(html.indexOf('Thuan')).toBeGreaterThan(-1);
      })
    );
  });

  describe('Test add new customer', () => {
    beforeEach(
      fakeAsync(() => {
        component.getCustomers();
        tick();
        fixture.detectChanges();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        component.formAdd.setValue({
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address
        });
        fixture.detectChanges();
        let button = fixture.debugElement.query(By.css('.add-cus'));
        click(button);
      })
    );

    it('should add new customer to customers property', () => {
      fixture.detectChanges();
      expect(
        _.findIndex(component.customers, p => (p.name = newCustomer.name))
      ).toBeGreaterThan(-1);
    });

    it(
      'should render new customer to table customers (html)',
      fakeAsync(() => {
        fixture.detectChanges();
        const html = fixture.debugElement
          .queryAll(By.css('td'))
          .map(each => each.nativeElement.innerText);
        expect(html.indexOf(newCustomer.name)).toBeGreaterThan(-1);
      })
    );
  });

  describe('Test delete customer', () => {
    beforeEach(
      fakeAsync(() => {
        component.getCustomers();
        tick();
        fixture.detectChanges();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        const idToTest = CUSTOMERS[0].id;
        let button = fixture.debugElement.query(By.css('.btn-revert'));
        click(button);
      })
    );

    it('should delete customer from customers', () => {
      fixture.detectChanges();
      expect(
        _.findIndex(component.customers, p => (p.id = this.idToTest))
      ).toBe(-1);
    });
  });

  describe('Test validations form', () => {
    it('should create formAdd with 4 fields', () => {
      expect(component.formAdd.contains('name')).toBeTruthy();
      expect(component.formAdd.contains('phone')).toBeTruthy();
      expect(component.formAdd.contains('address')).toBeTruthy();
      expect(component.formAdd.contains('email')).toBeTruthy();
    });

    it('field name should be required', () => {
      const control = component.formAdd.get('name');
      control.setValue('');
      expect(control.valid).toBeFalsy();
    });
  });
});
