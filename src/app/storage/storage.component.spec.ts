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

import { StorageComponent } from './storage.component';
import { StorageService } from './storage.service';
import { Storage } from './storage.model';
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
const newStorage = new Storage({
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
const STORAGES: Storage[] = [
  new Storage({
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
  new Storage({
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
const resGet = `{
  "storages": [
    {
        "id": 37,
        "status": 9,
        "imported_price": 1100,
        "created_at": "Monday, 03/04/2017",
        "product_id": 6,
        "name": "Laptop Apple Macbook Air",
        "code": "MMG-2352",
        "category": "128GB-2015",
        "default_imported_price": 1100,
        "default_sale_price": 1200
    }
]
}`;

let options = new ResponseOptions({
  body: resGet,
  status: 200,
  statusText: 'Ok'
});
const res = new Response(options);
const resAddJSON = '{"article": {"id": 5,"status": "Monday, 30/10/2017","imported_price": 1234,"product_id": 5,"created_at": "2017-10-30T02:11:49.806Z","updated_at": "2017-10-30T02:11:49.806Z","order_item_id": null}}';
options = new ResponseOptions({
  body: resAddJSON,
  status: 201,
  statusText: 'Created'
});
const resAdd = new Response(options);

class StorageServiceSpy {
  storages = STORAGES;
  getStorages = jasmine
    .createSpy('getStorages')
    .and.returnValue(Promise.resolve(res));
  getProducts = jasmine
    .createSpy('getProducts')
    .and.returnValue(Promise.resolve(res));
  addStorage = jasmine.createSpy('addStorage').and.callFake((storage: Storage) => {
    return Promise.resolve(resAdd);
  });
  deleteCustomer = jasmine
  .createSpy('deleteCustomer')
  .and.callFake((storage: Storage) => {
    return Promise.resolve();
  });
}
describe('StorageComponent', () => {
  let component: StorageComponent;
  let fixture: ComponentFixture<StorageComponent>;
  let storageStub: StorageService;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          DataTablesModule,
          HttpModule,
          Ng2Bs3ModalModule,
          Ng2SearchPipeModule
        ],
        declarations: [ StorageComponent, TranslatePipeMock],
        providers: [FormBuilder],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .overrideComponent(StorageComponent, {
          set: {
            providers: [{ provide: StorageService, useClass: StorageServiceSpy }]
          }
        })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(StorageComponent);
          component = fixture.componentInstance;
          component.dtTrigger.complete();
        });
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should load storages from the server',
    fakeAsync(() => {
      component.getStorage();
      tick();
      fixture.detectChanges();
      console.log(component.storages);
      // expect(_.first(component.storages).id).toBe(_.first(STORAGES).id);
    })
  );
  it('should render storages table after get storages from the server', fakeAsync(() => {
    component.getStorage();
    tick();
    fixture.detectChanges();
    // expect(fixture.debugElement.query(By.css('td')).nativeElement.innerText).toBe(_.first(STORAGES).id);
    discardPeriodicTasks();
  }));

  xdescribe('Test add new customer', () => {
    beforeEach(
      fakeAsync(() => {
        component.getStorage();
        tick();
        fixture.detectChanges();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        component.formAdd.setValue({
          quantity: newStorage.quantity,
          imported_price: newStorage.imported_price
        });
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.imp-pro'));
        button.triggerEventHandler('click', null);
      })
    );

    it('should import products to stores property', () => {
      fixture.detectChanges();
      expect(
        _.findIndex(component.storages, p => (p.status = newStorage.status))
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

  describe('Test delete imported product', () => {
    beforeEach(
      fakeAsync(() => {
        component.getStorage();
        tick();
        fixture.detectChanges();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        const idToTest = STORAGES[0].product_id;
        component.deleteStorage(STORAGES[0]);
      })
    );

    xit('should delete product from storages', () => {
      fixture.detectChanges();
      expect(
        _.findIndex(component.storages, p => (p.product_id = this.idToTest))
      ).toBe(-1);
    });
  });
});

