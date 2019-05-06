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
import {
  FormBuilder
} from '@angular/forms';

import { click, advance } from '../../testing';

import { StoreComponent } from './store.component';
import { StoreService } from './store.service';
import { Store } from './store.model';
import { DataTablesModule } from 'angular-datatables';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Ng2Bs3ModalModule, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
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
const newStorage = new Store({
  id: 37,
  status: '9',
  imported_price: 1100,
  created_at: 'Monday, 03/04/2017',
  product_id: 6,
  name: 'Laptop Apple Macbook Air',
  code: 'MMG-2352',
  category: '128GB-2015',
  default_imported_price: 1100,
  default_sale_price: 1200
});
const STORES: Store[] = [
  new Store({
    id: 37,
    status: '9',
    imported_price: 1100,
    created_at: 'Monday, 03/04/2017',
    product_id: 6,
    name: 'Laptop Apple Macbook Air',
    code: 'MMG-2352',
    category: '128GB-2015',
    default_imported_price: 1100,
    default_sale_price: 1200
  }),
  new Store({
    id: 58,
    status: '11',
    imported_price: 680,
    created_at: 'Saturday, 03/06/2017',
    product_id: 8,
    name: 'iPad Pro',
    code: 'WIF-1056',
    category: '64GB-2017',
    default_imported_price: 678,
    default_sale_price: 699
  })
];
// tslint:disable-next-line:max-line-length
const resGet = {
  stores: [
      {
          id: 37,
          status: 9,
          imported_price: 1100,
          created_at: 'Monday, 03/04/2017',
          product_id: 6,
          name: 'Laptop Apple Macbook Air',
          code: 'MMG-2352',
          category: '128GB-2015',
          default_imported_price: 1100,
          default_sale_price: 1200
      },
      {
          id: 58,
          status: '11',
          imported_price: 680,
          created_at: 'Saturday, 03/06/2017',
          product_id: 8,
          name: 'iPad Pro',
          code: 'WIF-1056',
          category: '64GB-2017',
          default_imported_price: 678,
          default_sale_price: 699
      }
  ]
};

let options = new ResponseOptions({
  body: resGet,
  status: 200,
  statusText: 'Ok'
});
const res = new Response(options);
const resAddJSON = {"article": {"id": 5,"status": "Monday, 30/10/2017","imported_price": 1234,"product_id": 5,"created_at": "2017-10-30T02:11:49.806Z","updated_at": "2017-10-30T02:11:49.806Z","order_item_id": null}};
options = new ResponseOptions({
  body: resAddJSON,
  status: 201,
  statusText: 'Created'
});
const resAdd = new Response(options);

class StoreServiceSpy {
  stores = STORES;
  getStores = jasmine
    .createSpy('getStores')
    .and.returnValue(Promise.resolve(res));

  getProducts = jasmine
    .createSpy('getProducts')
    .and.returnValue(Promise.resolve(res));

  addStorage = jasmine.createSpy('addStore').and.callFake((store: Store) => {
    return Promise.resolve(resAdd);
  });
}
describe('StoreComponent', () => {
  let component: StoreComponent;
  let fixture: ComponentFixture<StoreComponent>;
  let storeStub: StoreService;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          DataTablesModule,
          HttpModule,
          Ng2Bs3ModalModule,
          Ng2SearchPipeModule
        ],
        declarations: [ StoreComponent, TranslatePipeMock],
        providers: [FormBuilder],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .overrideComponent(StoreComponent, {
          set: {
            providers: [{ provide: StoreService, useClass: StoreServiceSpy }]
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(StoreComponent);
          component = fixture.componentInstance;
          component.dtTrigger.complete();
        });
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should load stores from the server',
    fakeAsync(() => {
      component.getStore();
      tick();
      expect(_.first(component.stores).id).toBe(_.first(STORES).id);
    })
  );

  it('should render stores table after get stores from the server', fakeAsync(() => {
    component.getStore();
    tick();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('td')).nativeElement.innerText).toBe(_.first(STORES).name);
    discardPeriodicTasks();
  }));

  describe('Test add new Strore', () => {
    beforeEach(
      fakeAsync(() => {
        component.getStore();
        tick();
        fixture.detectChanges();
        component.getProduct();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        component.formAdd.setValue({
          newStoragequantity: newStorage.status,
          newStorageImportedPrice: newStorage.imported_price
        });
        tick();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.imp-pro'));
        button.triggerEventHandler('click', null);
      })
    );

    xit('should import products to stores property', () => {
      component.addstorage();
      tick();
      fixture.detectChanges();
      expect(
        _.findIndex(component.stores, p => (p.quantity = newStorage.quantity))
      ).toBeGreaterThan(-1);
    });

    xit(
      'should render stores to table stores (html)',
      fakeAsync(() => {
        fixture.detectChanges();
        const html = fixture.debugElement
          .queryAll(By.css('td'))
          .map(each => each.nativeElement.innerText);
        expect(html.indexOf(newStorage.name)).toBeGreaterThan(-1);
      })
    );
  });
});

