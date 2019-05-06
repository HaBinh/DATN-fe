import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  discardPeriodicTasks
} from "@angular/core/testing";
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  PipeTransform,
  Pipe
} from "@angular/core";
import { HttpModule, Response, ResponseOptions } from "@angular/http";
import { By } from "@angular/platform-browser";
import { FormBuilder } from "@angular/forms";

import { click, advance } from "../../testing";
import { DataTablesModule } from "angular-datatables";
import { Observable } from "rxjs/Rx";
import * as _ from "lodash";
import { Ng2Bs3ModalModule, ModalComponent } from "ng2-bs3-modal/ng2-bs3-modal";
import { DialogService } from "ng2-bootstrap-modal";

import { RateComponent } from './rate.component';
import { Rate } from './rate.model';
import { RateService } from './rate.service';

@Pipe({
  name: 'translate'
})
class TranslatePipeMock implements PipeTransform {
  public name: string = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

const newRate = new Rate({
  id: 5,
  rate: 0.15
});
const RATES: Rate[] = [
  new Rate({
    id: 1,
    rate: 0
  }),
  new Rate({
    id: 2,
    rate: 0.02
  }),
  new Rate({
    id: 3,
    rate: 0.1
  }),
  new Rate({
    id: 4,
    rate: 0.2
  })
];

// tslint:disable-next-line:max-line-length
const resGet = `{"discounted_rates":[
                      {"id":1,"rate":0},
                      {"id":2,"rate":0.02},
                      {"id":3,"rate":0.1},
                      {"id":4,"rate":0.2}
                      ]}`;
let options = new ResponseOptions({
  body: resGet,
  status: 200,
  statusText: 'Ok'
});
const res = new Response(options);
const resAddJSON = '{"rate":{"id":5,"rate":0.15}}';
options = new ResponseOptions({
  body: resAddJSON,
  status: 201,
  statusText: 'Created'
});
const resAdd = new Response(options);

class RateServiceSpy {
  rates = RATES;
  getRates = jasmine
    .createSpy('getRates')
    .and.returnValue(Promise.resolve(res));
  updateRate = jasmine.createSpy('updateRate').and.callFake((rate: Rate) => {
    return Promise.resolve();
  });
  addRate = jasmine.createSpy('addRate').and.callFake((rate: Rate) => {
    return Promise.resolve(resAdd);
  });
  deleteRate = jasmine.createSpy('deleteRate').and.callFake((rate: Rate) => {
    return Promise.resolve();
  });
}
xdescribe('RateComponent', () => {
  let component: RateComponent;
  let fixture: ComponentFixture<RateComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [DataTablesModule, HttpModule, Ng2Bs3ModalModule],
        declarations: [RateComponent, TranslatePipeMock],
        providers: [FormBuilder, DialogService],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .overrideComponent(RateComponent, {
          set: {
            providers: [{ provide: RateService, useClass: RateServiceSpy }]
          }
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should load rates from the server',
    fakeAsync(() => {
      component.getRates();
      tick();
      expect(_.first(component.rates).rate).toBe(_.first(RATES).rate);
    })
  );

  it(
    'should render rates table after get rates from the server',
    fakeAsync(() => {
      component.getRates();
      tick();
      fixture.detectChanges();
      tick(); // wait to dt trigger execute but not necessary, can remove it
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.rate')).nativeElement.innerText
      ).toContain(RATES[1].rate * 100);
      discardPeriodicTasks();
    })
  );

  it(
    'should switch to editing when click pencil icon',
    fakeAsync(() => {
      component.getRates();
      tick();
      fixture.detectChanges();
      tick(); // wait to dt trigger execute but not necessary, can remove it
      fixture.detectChanges();
      const editIcon = fixture.debugElement.query(By.css('.fa-pencil'));
      editIcon.triggerEventHandler('click', null);
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
    'should revert edit when click check icon',
    fakeAsync(() => {
      component.getRates();
      tick();
      fixture.detectChanges();
      component.editing = 2;
      tick();
      fixture.detectChanges();
      const inputFeild = fixture.debugElement.query(By.css('.edit'));
      inputFeild.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();
      expect(component.editing).toBe(-1);
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
    'should change To Add',
    fakeAsync(() => {
      component.changeToAdd();
      expect(component.adding).toBe(1);
    })
  );

  describe('Test update rate', () => {
    beforeEach(
      fakeAsync(() => {
        component.getRates();
        tick();
        fixture.detectChanges();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        const value = {
          newRate: 11
        };
        component.editRate(value, RATES[1], 'click');
      })
    );

    it(
      'should update rates property',
      fakeAsync(() => {
        expect(
          _.findIndex(component.rates, p => (p.rate = 0.11))
        ).toBeGreaterThan(-1);
        discardPeriodicTasks();
      })
    );

    it(
      'should update html',
      fakeAsync(() => {
        fixture.detectChanges();
        const html = fixture.debugElement.query(By.css('.rate')).nativeElement
          .innerText;
        expect(html).toContain('11');
      })
    );
  });

  describe('Test add new rate', () => {
    beforeEach(
      fakeAsync(() => {
        component.getRates();
        component.adding = 1;
        tick();
        fixture.detectChanges();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        component.formAdd.setValue({
          newRateAdd: newRate.rate
        });
        fixture.detectChanges();
        let button = fixture.debugElement.query(By.css('.rate-add'));
        button.triggerEventHandler('click', null);
      })
    );

    it('should add new rate to rates property', () => {
      fixture.detectChanges();
      expect(
        _.findIndex(component.rates, p => (p.rate = newRate.rate))
      ).toBeGreaterThan(-1);
    });

    it(
      'should render new rate to table rates (html)',
      fakeAsync(() => {
        fixture.detectChanges();
        const html = fixture.debugElement
          .queryAll(By.css('.rate'))
          .map(each => each.nativeElement.innerText);
        console.log(html);
        expect(html.indexOf(newRate.rate * 100 + '%')).toBeGreaterThan(-1);
      })
    );
  });

  describe('Test delete rate', () => {
    beforeEach(
      fakeAsync(() => {
        component.getRates();
        tick();
        fixture.detectChanges();
        tick(); // wait to dt trigger execute but not necessary, can remove it
        fixture.detectChanges();
        const idToTest = RATES[1].id;
        component.deleteRate(RATES[1]);
      })
    );

    it('should delete rate from rates', () => {
      fixture.detectChanges();
      expect(_.findIndex(component.rates, p => (p.id = this.idToTest))).toBe(
        -1
      );
    });
  });
});
