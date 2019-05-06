import { CategoryDiscount } from './../category-discount/categoryDiscount.model';
import { CategoryDiscountService } from './../category-discount/categoryDiscount.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {
  map,
  switchMap,
  shareReplay,
  debounceTime,
  distinctUntilChanged,
  mergeMap,
  tap,
  filter
} from "rxjs/operators";
import { Product } from './product.model';
import { ProductsService } from '../core/products.service';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl
} from '@angular/forms';
import { BsModalComponent } from "ng2-bs3-modal";
import { getLangUrl } from '../shared/get_url_lang';
import { ManagementService } from '../shared/management.service';
import { ToastrService } from "../shared/toastr.service";
import * as _ from 'lodash';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";
import { from } from 'rxjs/observable/from';
@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  providers: [DecimalPipe]
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("modal") modal: BsModalComponent;
  @ViewChild("modalEditProduct") modalEditProduct: BsModalComponent;
  @ViewChild("modalDelete") modalDelete: BsModalComponent;

  isManager: boolean;
  isLoading = false;
  editProductId = 0;
  // declare form
  formEditProduct: FormGroup;
  formEdit: FormGroup;
  newProductForm: FormGroup;
  // delcare datatable modules
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  products: Product[];
  productEdit: any;
  rates: any;
  discounted_rates: any;
  rates_to_edit: number[] = [];
  product_id_to_edit = -1;
  product_to_delete: Product;
  editing = -1;
  tam = 1;
  deleted: any;
  product_id = 0;
  getProducts$: Observable<any>;
  categories$: Observable<CategoryDiscount[]>;

  keyUpSearch = new Subject<string>();

  currentPage = 1;
  currentSearch = "";
  showCount: number = 10;

  asyncProducts: Product[];
  loading: boolean;

  public configPagination = {
    id: "server",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 10
  };

  constructor(
    private management: ManagementService,
    private categoryService: CategoryDiscountService,
    private productsSvc: ProductsService,
    private toastrService: ToastrService,
    private decimalPipe: DecimalPipe,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getProducts$ = this.productsSvc.getProducts().shareReplay(1);

    this.getPage(1);
    this.categories$ = this.categoryService.getCategories();

    const subscriptionSearch = this.keyUpSearch
      .do(search => (this.currentSearch = search))
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(search => this.productsSvc.getProductsWithPage(1, search, this.showCount))
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = 1;
        this.loading = false;
      })
      .map(res => res.products)
      .subscribe(res => {
        this.asyncProducts = res;
        this.getCategoriesAfterGetProduct(res);
      });

    this.management.isManager().subscribe(res => {
      this.isManager = this.management.validateToken$;
    });
  }

  onChangeCount($event) {
    this.productsSvc
      .getProductsWithPage(this.currentPage, this.currentSearch, this.showCount)
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = 1;
        this.loading = false;
      })
      .map(res => res.products)
      .subscribe(res => {
        this.asyncProducts = res;
        this.getCategoriesAfterGetProduct(res);
      });
  }

  getPage(page: number) {
    this.currentPage = page;
    this.loading = true;
    this.productsSvc
      .getProductsWithPage(page, this.currentSearch, this.showCount)
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = page;
        this.loading = false;
      })
      .map(res => res.products)
      .subscribe(res => {
        this.asyncProducts = res;
        this.getCategoriesAfterGetProduct(res);
      });
  }

  getCategoriesAfterGetProduct(products: Product[]) {
    var ids = _.compact(_.uniq(products.map(product => product.category_id)));
    from(ids).pipe(
      mergeMap(id => this.categoryService.getCategoryWithId(id))
    )
      .subscribe(category => {
        this.asyncProducts.forEach(product => {
          if (product.category_id === category.id) {
            product.category = category;
          }
        })
      })
  }

  ngAfterViewInit() {
    // Reset product id to edit when close on dismis modal
    this.modalEditProduct.onDismiss.subscribe(() => {
      this.product_id_to_edit = -1;
    });
  }

  getDiscountRate() {
    this.productsSvc.getRates().subscribe(rates => {
      this.discounted_rates = rates;
      this.rates_to_edit = this.discounted_rates.map(rate => rate.rate * 100);
    });
  }

  addProduct() {
    const rates_to_upload = this.rates_to_edit.map(rate =>
      this.decimalPipe.transform(rate / 100, "1.0-4")
    );
    let body_upload = _.pickBy(this.newProductForm.value);
    body_upload = _.assign(body_upload, { rates: rates_to_upload });
    this.productsSvc.addProduct(body_upload).subscribe(product => {
      this.asyncProducts.push(product);
      this.getCategoriesAfterGetProduct(new Array(product));
      this.configPagination.totalItems++;
      this.toastrService.SetMessageSuccessTranslate("message.product.add");
      this.modal.close();
      this.formEdit.reset();
      this.newProductForm.reset();
    });
  }

  deleteProduct(id: number) {
    this.productsSvc.deleteProduct(id).subscribe(res => {
      // this.asyncProducts = this.asyncProducts.map(products =>  products.filter(p => p.id !== id));
      this.asyncProducts = this.asyncProducts.filter(p => p.id !== id);
      this.toastrService.SetMessageInfoTranslate("message.product.delete");
    });
  }

  openDeleteModal(product: Product) {
    this.product_to_delete = product;
    this.modalDelete.open();
  }

  openEditModal(product: Product) {
    // set value in form
    this.product_id_to_edit = product.id;
    this.formEditProduct.patchValue({
      name: product.name,
      unit: product.unit,
      code: product.code,
      default_imported_price: product.default_imported_price,
      default_sale_price: product.default_sale_price,
      category_id: product.category_id
    });
    this.rates_to_edit = product.rates.map(rate => rate * 1000 / 10);
    this.modalEditProduct.open();
  }

  updateProduct() {
    const rates_to_upload = this.rates_to_edit.map(rate =>
      this.decimalPipe.transform(rate / 100, "1.0-4")
    );
    let body_upload = _.pickBy(this.formEditProduct.value);
    body_upload = _.assign(body_upload, { rates: rates_to_upload });

    this.productsSvc
      .updateProduct(this.product_id_to_edit, body_upload)
      .subscribe(product => {
        _.assign(this.asyncProducts.find(t => t.id === product.id), product);
        this.toastrService.SetMessageSuccessTranslate(
          "message.product.edit-success"
        );
        this.getCategoriesAfterGetProduct(new Array(product));
        this.modalEditProduct.close();
        this.formEdit.reset();
        this.formEditProduct.reset();
      });
  }

  onChangeCategory(category_id) {
    if (category_id != "") {
      this.categoryService.getCategoryWithId(category_id).subscribe(category => {
        this.discounted_rates = category.rates;
        this.rates_to_edit = this.discounted_rates.map(rate => rate * 100);
      });
    } else {
      this.getDiscountRate();
    }
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  ngOnDestroy(): void { }

  private toggleLoading() {
    this.isLoading = !this.isLoading;
  }

  private buildForm() {
    this.formEdit = this.fb.group({
      newRate: ["", Validators.compose([Validators.required])]
    });
    this.formEditProduct = this.fb.group({
      name: ["", Validators.required],
      unit: ["", Validators.required],
      code: ["", Validators.required, this.validateCodeNotTaken.bind(this)],
      default_imported_price: [
        "",
        Validators.compose([Validators.min(0), Validators.required])
      ],
      default_sale_price: [
        "",
        Validators.compose([Validators.min(0), Validators.required])
      ],
      category_id: [""]
    });
    this.newProductForm = this.fb.group({
      name: ["", Validators.required],
      code: ["", Validators.required, this.validateCodeNotTaken.bind(this)],
      unit: ["", Validators.required],
      default_imported_price: [
        "",
        Validators.compose([Validators.min(0), Validators.required])
      ],
      default_sale_price: [
        "",
        Validators.compose([Validators.min(0), Validators.required])
      ],
      category_id: [""]
    });
  }

  validateCodeNotTaken(control: AbstractControl) {
    return this.getProducts$
      .map(res => res.products)
      .map(products =>
        products.filter(product => product.id !== this.product_id_to_edit)
      )
      .map(products =>
        products.filter(product => product.code === control.value)
      )
      .map(products => !products.length)
      .map(res => (res ? null : { codeTaken: true }));
  }

  trackProductByFn(index, song) {
    return index; // or song.id
  }
}
