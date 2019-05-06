import { Component, OnInit, transition } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';

import { environment } from '../../environments/environment.prod';
import { StorageService } from './storage.service';
import { Storage } from './storage.model';
import { Product } from '../products/product.model';
import * as _ from 'lodash';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsModalComponent } from "ng2-bs3-modal";
import { ToastrService } from "../shared/toastr.service";
import { ManagementService } from "../shared/management.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-storage",
  templateUrl: "./storage.component.html",
  styleUrls: ["./storage.component.css"],
  providers: [StorageService]
})
export class StorageComponent implements OnInit {
  isLoading = false;
  res: any;
  formAdd: FormGroup;
  formEdit: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  storages: Storage[];
  asyncStorages: Storage[];
  updateAdd: Storage;
  products: Product[]= [];
  lists: Array<any> = [];
  newStorage: Storage = new Storage();
  editing = "";
  editing1 = "";
  adding = -1;
  loading: boolean;
  term: any;
  total: number;
  keyUpSearch = new Subject<string>();
  lang$ = "vi";
  currentPage = 1;
  currentSearch = "";
  showCount = 10;
  isManager: boolean;

  public configPagination = {
    id: "server",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 10
  };
  constructor(
    private management: ManagementService,
    private http: Http,
    private translate: TranslateService,
    private storageService: StorageService,
    private toastrService: ToastrService,
    fb: FormBuilder
  ) {
    this.formAdd = fb.group({
      newStoragequantity: ["0", Validators.compose([Validators.required])],
      newStorageImportedPrice: ["", Validators.compose([Validators.required])]
    });
    this.formEdit = fb.group({
      newQuantity: ["", Validators.compose([Validators.required])],
      newImportedPrice: ["", Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      order: []
    };
    this.lang$ = this.translate.getBrowserLang();
    this.getProduct();
    this.getPage(1);
    this.management.isManager().subscribe(res => {
      this.isManager = this.management.validateToken$;
    });
    const subscriptionSearch = this.keyUpSearch
      .do(search => (this.currentSearch = search))
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(search => this.storageService.getStorageWithPage(1, search, this.showCount))
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = 1;
        this.loading = false;
      })
      .map(res => res.articles)
      .subscribe(res => (this.asyncStorages = res));
  }
  getPage(page: number) {
    this.currentPage = page;
    this.loading = true;
    this.storageService
      .getStorageWithPage(page, this.currentSearch, this.showCount)
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = page;
        this.loading = false;
      })
      .map(res => res.articles)
      .subscribe(res => (this.asyncStorages = res));
  }

  onChangeCount($event) {
    this.storageService
      .getStorageWithPage(this.currentPage, this.currentSearch, this.showCount)
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = 1;
        this.loading = false;
      })
      .map(res => res.articles)
      .subscribe(res => (this.asyncStorages = res));
  }

  getProduct() {
    this.storageService.getProducts().then(res => {
      this.products = res.json().products as Product[];
    });
  }

  deleteStorage(storage: Storage) {
    event.stopPropagation();
    this.storageService.deleteStorage(storage).then(() => {
      this.asyncStorages = this.asyncStorages.filter(v => v.id !== storage.id);
      this.toastrService.SetMessageSuccess("Success");
    });
  }

  changeToEdit(storage: Storage, event: any) {
    event.stopPropagation();
    this.editing = storage.code;
    this.editing1 = storage.created_at;
  }

  editStorage(value: any, storage: Storage) {
    if (value.newImportedPrice === "") {
      value.newImportedPrice = storage.imported_price;
    }
    if (value.newQuantity === "") {
      value.newQuantity = storage.quantity;
    }
    this.storageService.updateStorage(value, storage).then(() => {
      this.asyncStorages.find(
        res =>
          res.created_at === storage.created_at
      ).quantity =
        value.newQuantity;
      this.asyncStorages.find(
        res =>
          res.created_at === storage.created_at
      ).imported_price =
        value.newImportedPrice;
      this.revertEdit();
    });
  }

  revertEdit() {
    this.editing = "";
    this.editing1 = "";
  }

  changeToAdd(product: Product, event: Event) {
    event.stopPropagation();
    this.newStorage.quantity = 1;
    this.newStorage.id = this.products.find(
      res => res.code === product.code
    ).id;
    this.newStorage.imported_price = this.products.find(res => res.code === product.code).default_imported_price;
  }

  addstorage() {
    this.term = "";
    this.storageService.addStorage(this.newStorage).then(res => {
      this.updateAdd = res.json().article as Storage;
      this.asyncStorages.unshift(this.updateAdd);
      this.configPagination.totalItems ++;
      this.revertAdd();
      this.toastrService.SetMessageSuccessTranslate("message.crated-articler");
    })
    .catch(err => {
      this.toastrService.SetMessageInfoTranslate("message.import");
    });
    this.revertAdd();
  }

  revertAdd() {
    this.term = "";
  }
}
