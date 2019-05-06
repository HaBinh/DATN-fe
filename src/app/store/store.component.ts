import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { environment } from '../../environments/environment.prod';
import { StoreService } from './store.service';
import { Store } from './store.model';
import { Product } from '../products/product.model';
import * as _ from 'lodash';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsModalComponent } from "ng2-bs3-modal";
import { getLangUrl }           from '../shared/get_url_lang';
import { ManagementService } from '../shared/management.service';
import { ToastrService } from "../shared/toastr.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.css"],
  providers: [StoreService]
})
export class StoreComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  stores: Store[];
  products: Product[]= [];
  formAdd: FormGroup;
  updateAdd: any;
  lists: Array<any> = [];
  newStorage: Store = new Store();
  editing = -1;
  adding = -1;
  loading: boolean;
  term: any;
  lang$ = "vi";
  isManager: boolean;
  asyncStores: Store[];
  keyUpSearch = new Subject<string>();

  currentPage = 1;
  currentSearch = "";
  showCount = 10;

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
    private storeService: StoreService,
    private toastrService: ToastrService,
    fb: FormBuilder
  ) {
    this.formAdd = fb.group({
      newStoragequantity: ["", Validators.required],
      newStorageImportedPrice: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      order: [],
      language: {
        url: getLangUrl()
      }
    };
    this.lang$ = this.translate.getBrowserLang();
    this.getPage(1);
    this.getProduct();
     const subscriptionSearch = this.keyUpSearch
      .do(search => (this.currentSearch = search))
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(search => this.storeService.getStoreWithPage(1, search, this.showCount))
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = 1;
        this.loading = false;
      })
      .map(res => res.stores)
      .subscribe(res => (this.asyncStores = res));

    this.management.isManager().subscribe(res => {
      this.isManager = this.management.validateToken$;
    });
  }

  getPage(page: number) {
    this.currentPage = page;
    this.loading = true;
    this.storeService
      .getStoreWithPage(page, this.currentSearch, this.showCount)
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = page;
        this.loading = false;
      })
      .map(res => res.stores)
      .subscribe(res => (this.asyncStores = res));
  }

  onChangeCount($event) {
    this.storeService
      .getStoreWithPage(this.currentPage, this.currentSearch, this.showCount)
      .do(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = 1;
        this.loading = false;
      })
      .map(res => res.stores)
      .subscribe(res => (this.asyncStores = res));
  }

  getProduct() {
    this.storeService.getProducts().then(res => {
      this.products = res.json().products as Product[];
    });
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
    this.storeService.addStorage(this.newStorage).then(res => {
      this.updateAdd = res.json().store as Storage;
      this.asyncStores.unshift(this.updateAdd);
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
