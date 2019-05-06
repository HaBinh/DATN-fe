import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CustomerService } from '../../customer/customer.service';
import { ToastrService } from '../toastr.service';
import { OrderService } from '../../order/order.service';
import { Customer } from '../../customer/customer.model';
import { Order } from '../../order/order.model';
import { Subject, Observable }  from 'rxjs/Rx';
import { BsModalComponent } from "ng2-bs3-modal";
import { TranslateService }     from '@ngx-translate/core';
import { getLangUrl }           from '../get_url_lang';
import * as _ from 'lodash';
import 'rxjs/add/operator/takeWhile';

@Component({
  // tslint:disable-next-line:component-selector
  selector: "list-customers-in-debt",
  templateUrl: "./customers-in-debt.component.html",
  styleUrls: ["./customers-in-debt.component.css"]
})
export class CustomersInDebtComponent implements OnInit, OnDestroy {
  @ViewChild("modal") modal: BsModalComponent;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  customers: Customer[];
  selectedCustomer: Customer = new Customer();
  private alive = true;
  customer:  Customer;

  constructor(
    private customerSvc: CustomerService,
    private orderSvc: OrderService,
    private toastrSvc: ToastrService
  ) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: "simple_numbers",
      language: {
        url: getLangUrl()
      }
    };

    this.customerSvc
      .getCustomersInDebt()
      .takeWhile(() => this.alive)
      .subscribe(customers => {
        this.customers = customers;
        this.dtTrigger.next();
      });
  }

  payTotalDebt(customer_id: number, payment: number) {
    console.log(customer_id);
    this.orderSvc.payTotalDebt(customer_id, payment)
      .takeWhile(() => this.alive)
      .subscribe(customer => {
        this.customer = customer;
        _.assign(this.customers.find(res => res.id === customer["0"].id), customer["0"]);
        this.toastrSvc.SetMessageSuccessTranslate("message.pay-debt");
      });
  }

  payDebt(order_id: string, payment: number) {
    this.orderSvc
      .payDebt(order_id, payment)
      .takeWhile(() => this.alive)
      .subscribe((order: Order) => {
        Object.assign(
          this.selectedCustomer.orders_not_fully_paid.find(
            (e: Order) => e.id === order_id
          ),
          order
        );
        this.selectedCustomer.orders_not_fully_paid =
          // tslint:disable-next-line:no-shadowed-variable
          _.reject(
            this.selectedCustomer.orders_not_fully_paid,
            order => order.debt === 0
          );
        if (_.size(this.selectedCustomer.orders_not_fully_paid) === 0) {
          this.customers = _.reject(
            this.customers,
            customer => customer.id === this.selectedCustomer.id
          );
        }
        this.toastrSvc.SetMessageSuccessTranslate("message.pay-debt");
      });
  }

  totalDebt(customer: Customer): number {
    return _.sumBy(customer.orders_not_fully_paid, "debt");
  }

  openOrder(customer: Customer) {
    this.selectedCustomer = customer;
    this.modal.open();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
