import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersInDebtComponent } from './customers-in-debt.component';

xdescribe('CustomersInDebtComponent', () => {
  let component: CustomersInDebtComponent;
  let fixture: ComponentFixture<CustomersInDebtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersInDebtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersInDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
