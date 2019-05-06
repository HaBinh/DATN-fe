import { Component, OnInit, ViewChild } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from "@angular/forms";

import { environment } from "../../environments/environment.prod";
import { BsModalComponent } from "ng2-bs3-modal";
import { ToastrService } from '../shared/toastr.service';
import { CategoryDiscountService } from "./categoryDiscount.service";
import { CategoryDiscount } from "./categoryDiscount.model";
import { ChartsModule } from "ng2-charts";
import { DecimalPipe } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";

@Component({
  selector: 'app-category-discount',
  templateUrl: './category-discount.component.html',
  styleUrls: ['./category-discount.component.css'],
  providers: [CategoryDiscountService, DecimalPipe]
})
export class CategoryDiscountComponent implements OnInit {
  @ViewChild("modal") modal: BsModalComponent;
  @ViewChild("modalDelete") modalDelete: BsModalComponent;
  @ViewChild("modalEditCategory") modalEditCategory: BsModalComponent;
  @ViewChild("modalChange") modalChange: BsModalComponent;
  categoryDiscounts: CategoryDiscount[];
  categoryEdit: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  loading: boolean;
  keyUpSearch = new Subject<string>();
  perPage = 10;
  currentSearch = "";
  category: any;
  category_id_to_edit = -1;
  rates_to_edit: number[] = [];
  discounted_rates: any;
  formEditCategory: FormGroup;
  formEdit: FormGroup;
  newCategoryForm: FormGroup;

  public configPagination = {
    id: "server",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };


  constructor(
    private http: Http,
    private categoryDiscountService: CategoryDiscountService,
    private toastrService: ToastrService,
    private decimalPipe: DecimalPipe,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers"
    };
    this.getPage(1);
  }
  getPage(page: number) {
    this.loading = true;
    this.categoryDiscountService.getCategoryDiscountsWithPage(page, this.perPage, this.currentSearch)
      .subscribe(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = page;
        this.categoryDiscounts = res.categories;
        this.loading = false;
      });
  }
  onChangeCount($event) {
    this.loading = true;
    this.categoryDiscountService.getCategoryDiscountsWithPage(1, this.perPage, this.currentSearch)
      .subscribe(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.itemsPerPage = this.perPage;
        this.configPagination.currentPage = 1;
        this.categoryDiscounts = res.categories;
        this.loading = false;
      });
  }
  openChangeModal(rate: any) {
    this.category = rate;
    this.modalChange.open();
  }
  ChangeDiscount(id: number) {
    this.categoryDiscountService.ChangeDiscount(id).subscribe(res => {
      this.toastrService.SetMessageInfoTranslate("message.product.Change");
      this.modalChange.close();
    });
  }
  openDeleteModal(rate: any) {
    this.category = rate;
    this.modalDelete.open();
  }

  deleteCategory(id: number) {
    this.categoryDiscountService.deleteCategory(id).subscribe(res => {
      this.categoryDiscounts = this.categoryDiscounts.filter(p => p.id !== id);
      this.toastrService.SetMessageInfoTranslate("message.product.delete");
    });
    this.modalDelete.close();
  }

  openEditModal(categoryDiscount: CategoryDiscount) {
    // set value in form
    this.categoryEdit = categoryDiscount.category;
    this.category_id_to_edit = categoryDiscount.id;
    this.formEditCategory.patchValue({
      category: categoryDiscount.category
    });
    this.rates_to_edit = categoryDiscount.rates.map(rate => rate * 1000 / 10);
    this.modalEditCategory.open();
  }

  updateProduct() {
    const rates_to_upload = this.rates_to_edit.map(rate =>
      rate / 100, "1.0-4"
    );
    let body_upload = _.pickBy(this.formEditCategory.value);
    body_upload = _.assign(body_upload, { rates: rates_to_upload });

    this.categoryDiscountService
      .updateCategory(this.category_id_to_edit, body_upload)
      .subscribe(category => {
        _.assign(this.categoryDiscounts.find(t => t.id === category.id), category);
        this.toastrService.SetMessageSuccessTranslate(
          "message.product.edit-success"
        );
        this.modalEditCategory.close();
        this.formEdit.reset();
        this.formEditCategory.reset();
        this.category_id_to_edit = -1;
      });
  }

  getDiscountRate() {
    this.categoryDiscountService.getRates().subscribe(rates => {
      this.discounted_rates = rates;
      this.rates_to_edit = this.discounted_rates.map(rate => rate.rate * 100);
    });
  }

  addCategory() {
    const rates_to_upload = this.rates_to_edit.map(rate =>
      rate / 100, "1.0-4"
    );
    let body_upload = _.pickBy(this.newCategoryForm.value);
    body_upload = _.assign(body_upload, { rates: rates_to_upload });
    this.categoryDiscountService.addCategory(body_upload).subscribe(category => {
      this.categoryDiscounts.push(category);
      this.configPagination.totalItems++;
      this.toastrService.SetMessageSuccessTranslate("message.product.add");
      this.modal.close();
      this.formEdit.reset();
      this.newCategoryForm.reset();
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  private buildForm() {
    this.formEdit = this.fb.group({
      newRate: ["", Validators.compose([Validators.required])]
    });
    this.formEditCategory = this.fb.group({
      category: ["", Validators.required]
    });
    this.newCategoryForm = this.fb.group({
      category: ["", Validators.required]
    });
  }
}
