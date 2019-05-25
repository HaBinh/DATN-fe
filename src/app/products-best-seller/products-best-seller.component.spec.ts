import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsBestSellerComponent } from './products-best-seller.component';

describe('ProductsBestSellerComponent', () => {
  let component: ProductsBestSellerComponent;
  let fixture: ComponentFixture<ProductsBestSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsBestSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsBestSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
