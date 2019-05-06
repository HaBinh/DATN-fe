import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  PipeTransform,
  Pipe
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';

import { click, advance } from '../../testing';

import { ProductsComponent } from './products.component';
import { ProductsService } from '../core/products.service';
import { Product } from './product.model';
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

const newProduct = new Product(5, 'car', 'LAM', 'MX-127', 3000, 5000);

const PRODUCTS: Product[] = [
  new Product(1, 'laptop', 'ASUS', 'MX-123', 1000, 1200),
  new Product(2, 'phone', 'DELL', 'MX-124', 1000, 1200),
  new Product(3, 'TV', 'XIAOMI', 'MX-125', 1000, 1200),
  new Product(4, 'Table', 'Apple', 'MX-126', 1000, 1200)
];

class ProductServiceSpy {
  products = PRODUCTS;

  getProducts = jasmine
    .createSpy('getProducts')
    .and.returnValue(Observable.of(this.products));
  addProduct = jasmine
    .createSpy('addProduct')
    .and.callFake((value: Product) => {
      return Observable.of(value as Product);
    });
  updateProduct = jasmine
    .createSpy('updateProduct')
    .and.callFake((id: number, value: any) => {
      return Observable.of(1);
    });
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productStub: ProductsService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [DataTablesModule, HttpModule, Ng2Bs3ModalModule],
        declarations: [ProductsComponent, TranslatePipeMock],
        providers: [FormBuilder],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .overrideComponent(ProductsComponent, {
          set: {
            providers: [
              { provide: ProductsService, useClass: ProductServiceSpy }
            ]
          }
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productStub = fixture.debugElement.injector.get(ProductsService);
  });

  it(
    'should called get products from the server',
    fakeAsync(() => {
      fixture.detectChanges();
      expect(component.products).toBe(PRODUCTS);
    })
  );

  xit('should show modal when click create product button', () => {
    fixture.detectChanges();
    const button_create = fixture.debugElement.query(By.css('button'));
    button_create.triggerEventHandler('click', null);

    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('modal')).nativeElement;
    console.log(modal);
    expect(modal.style.display).toContain('inline');
  });

  it('should render product table after get products from the server', () => {
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('td')).nativeElement.innerText
    ).toBe(_.first(PRODUCTS).name);
  });

  describe('Test update product', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.updateProduct(PRODUCTS[0].id, newProduct);
    });

    it('should render input when click button pencil', () => {
      fixture.detectChanges();
      const pencil = fixture.debugElement.query(By.css('.green'));
      click(pencil);
      fixture.detectChanges();
      expect(component.editProductId).not.toBe(-1);
      // expect(fixture.debugElement.query(By.css('td')).nativeElement).toContain('input');
    });

    it('should update products property', () => {
      fixture.detectChanges();
      expect(
        _.findIndex(component.products, p => (p.name = newProduct.name))
      ).toBeGreaterThan(-1);
    });

    it('should update html', () => {
      fixture.detectChanges();
      const tds = fixture.debugElement.queryAll(By.css('td'));
      const texts = tds.map(each => each.nativeElement.innerText);
      expect(texts.indexOf(newProduct.name)).toBeGreaterThan(-1);
    });
  });

  describe('Test add new product', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.newProductForm.setValue({
        name: newProduct.name,
        code: newProduct.code,
        category: newProduct.unit,
        default_imported_price: newProduct.default_imported_price,
        default_sale_price: newProduct.default_sale_price
      });
      fixture.detectChanges();
      // component.addProduct(component.newProductForm.value);
      const button = fixture.debugElement.query(By.css('.add-product'));
      button.triggerEventHandler('click', null);
    });

    it('should add new product to products property ', () => {
      fixture.detectChanges();
      expect(
        _.findIndex(component.products, p => (p.name = newProduct.name))
      ).toBeGreaterThan(-1);
    });

    it('should render new product to table products', () => {
      fixture.detectChanges();
      const tds = fixture.debugElement.queryAll(By.css('td'));
      const texts = tds.map(each => each.nativeElement.innerText);
      expect(texts.indexOf(newProduct.name)).toBeGreaterThan(-1);
    });
  });

  describe('Test validations form', () => {
    it('should create form with 4 fields', () => {
      expect(component.form.contains('name')).toBeTruthy();
      expect(component.form.contains('category')).toBeTruthy();
      expect(component.form.contains('default_imported_price')).toBeTruthy();
      expect(component.form.contains('default_sale_price')).toBeTruthy();
    });

    it('should create new produc form with 5 fields', () => {
      expect(component.newProductForm.contains('name')).toBeTruthy();
      expect(component.newProductForm.contains('category')).toBeTruthy();
      expect(component.newProductForm.contains('code')).toBeTruthy();
      expect(
        component.newProductForm.contains('default_imported_price')
      ).toBeTruthy();
      expect(
        component.newProductForm.contains('default_sale_price')
      ).toBeTruthy();
    });

    it('field name should be required', () => {
      const control = component.form.get('name');

      control.setValue('');
      expect(control.valid).toBeFalsy();
    });

    it('field price should be greater than 0', () => {
      const sale_price = component.form.get('default_sale_price');
      sale_price.setValue(-1);
      expect(sale_price.valid).toBeFalsy();
    });

    it('field imported price should be greater than 0', () => {
      const imported_price = component.form.get('default_imported_price');
      imported_price.setValue(-1);
      expect(imported_price.valid).toBeFalsy();
    });
  });
});
