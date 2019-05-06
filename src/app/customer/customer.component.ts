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
import { BsModalComponent } from "ng2-bs3-modal";

import "rxjs/add/observable/of";
import "rxjs/add/operator/delay";
import { getLangUrl } from "../shared/get_url_lang";
import { environment } from "../../environments/environment";

import { CustomerService } from "./customer.service";
import { Customer } from './customer.model';
import { ToastrService } from '../shared/toastr.service';
import * as _ from "lodash";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
  providers: [CustomerService]
})
export class CustomerComponent implements OnInit {
  @ViewChild("modal") modal: BsModalComponent;
  @ViewChild("modalConfirm") modalConfirm: BsModalComponent;

  formAdd: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  customers: Customer[];
  customer: Customer = new Customer();
  cus: Customer = new Customer();
  lists: Array<any> = [];
  editing = -1;
  addvalue = 0;
  selectedValue = 0;
  levels: Array<number> = [0, 1, 2, 3, 4, 5, 6];
  customerSelected: Customer;
  loading: boolean;
  keyUpSearch = new Subject<string>();
  perPage = 10;
  currentSearch = "";

  public configPagination = {
    id: "server",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };

  constructor(
    private http: Http,
    private customerService: CustomerService,
    private toastrService: ToastrService,
    fb: FormBuilder
  ) {
    this.formAdd = fb.group({
      name: ["", Validators.required],
      phone: [""],
      email: [""],
      address: [""]
    });
  }

  ngOnInit() {
    this.getPage(1);

    const subscriptionSearch = this.keyUpSearch
      .do(search => {
        this.currentSearch = search;
        this.loading = true;
      })
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(search => this.customerService.getCustomersWithPage(1, this.perPage, this.currentSearch))
      .subscribe(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.currentPage = 1;
        this.customers = res.customers;
        this.loading = false;
      });
  }

  getCustomers() {
    this.loading = true;
    this.customerService.getCustomers().then(cus => {
      this.customers = cus.json().customers as Customer[];
      this.dtTrigger.next();
      this.loading = false;
    });
  }

  onChangeCount($event) {
    this.loading = true;
    this.customerService.getCustomersWithPage(1, this.perPage, this.currentSearch)
      .subscribe(res => {
        this.configPagination.totalItems = res.total;
        this.configPagination.itemsPerPage = this.perPage;
        this.configPagination.currentPage = 1;
        this.customers = res.customers;
        this.loading = false;
      })
  }

  getPage(page: number) {
    this.loading = true;
    this.customerService.getCustomersWithPage(page, this.perPage, this.currentSearch)
        .subscribe(res => {
          this.configPagination.totalItems = res.total;
          this.configPagination.currentPage = page;
          this.customers = res.customers;
          this.loading = false;
        })
  }

  openModalDelete(customer: Customer) {
    this.customerSelected = customer;
    this.modalConfirm.open();
  }

  deleteCustomer() {
    this.modalConfirm.close();
    this.sendRequestDeleteCustomer(this.customerSelected);
  }

  sendRequestDeleteCustomer(customer: Customer) {
    this.customerService.deleteCustomer(customer).then(res => {
      this.customers = _.reject(this.customers, ["id", customer.id]);
      this.toastrService.SetMessageSuccess("Success");
    });
  }

  changeToEdit(customer: Customer) {
    this.editing = customer.id;
    this.selectedValue = customer.level;
  }

  editCustomer(
    name: string,
    email: string,
    phone: string,
    add: string,
    level: number,
    id: number
  ) {
    this.customer.name = name;
    this.customer.email = email;
    this.customer.phone = phone;
    this.customer.address = add;
    this.customer.level = level;
    this.customerService
      .updateCustomer(this.customer, id)
      .subscribe(customer => {
        this.customers.find(cus => cus.id === customer.id).name = customer.name;
        this.customers.find(cus => cus.id === customer.id).email =
          customer.email;
        this.customers.find(cus => cus.id === customer.id).phone =
          customer.phone;
        this.customers.find(cus => cus.id === customer.id).address =
          customer.address;
        this.customers.find(cus => cus.id === customer.id).level =
          customer.level;
        this.revertEdit();
      });
  }

  revertEdit() {
    this.editing = -1;
  }

  addCustomer(value: any, selectedValue: number) {
    this.customerService
      .addCustomer(value, selectedValue)
      .subscribe((customer: Customer) => {
        this.customers.unshift(customer);
        this.formAdd.reset();
        this.addvalue = 0;
      });
  }
}
