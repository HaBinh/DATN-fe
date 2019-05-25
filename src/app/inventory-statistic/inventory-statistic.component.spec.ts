import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStatisticComponent } from './inventory-statistic.component';

describe('InventoryStatisticComponent', () => {
  let component: InventoryStatisticComponent;
  let fixture: ComponentFixture<InventoryStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
