import { Component, OnInit, OnDestroy, ViewChild }    from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Order }              from '../order.model';
import { OrderItem }         from '../order-item';
import { Customer }         from '../../customer/customer.model';
import { getLangUrl } from '../../shared/get_url_lang';

import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder }                 from '@angular/forms';
import { BsModalComponent } from "ng2-bs3-modal";
import { OrderService }         from '../order.service';
import { ToastrService }        from '../../shared/toastr.service';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';

@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.component.html",
  styleUrls: ["./order-history.component.css"],
  providers: [DatePipe]
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild("modal") modal: BsModalComponent;
  orders: Order[];
  orderItems: OrderItem[] = [];
  customerSelected: Customer;
  order_detail: Order;
  cssModalClass = "modal-test";
  loadingGetOrder: boolean;
  private alive = true;
  loading: boolean;
  public configPagination = {
    id: "server",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };

  currentPerPage = 10;
  currentSearchText = "";
  keyUpSearch = new Subject<string>();



  constructor(
    private orderService: OrderService,
    private toastrService: ToastrService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const subscriptionSearch = this.keyUpSearch
      .do(search => {
        this.currentSearchText = search;
      })
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(_ => {
        this.router.navigate(['/order-history'], { queryParams: { page: 1, per_page: this.currentPerPage, search: this.currentSearchText } })
      })

    this.route.queryParams
        .takeWhile(() => this.alive)
        .do(params => {
          this.loading = true;
          this.configPagination.currentPage = params.page;
          this.configPagination.itemsPerPage = params.per_page;
        })
        .switchMap(params => this.orderService.getOrdersWithPage(params.page, params.per_page, params.search))
        .subscribe(res => {
          this.orders = res.orders;
          this.configPagination.totalItems = res.total;
          this.loading = false;
        })
    this.getPage(1);
  }

  getPage(page_number: number) {
    this.router.navigate(['/order-history'], { queryParams: { page: page_number, per_page: this.currentPerPage, search: this.currentSearchText }})
  }

  onChangePerPage(event) {
    this.router.navigate(['/order-history'], { queryParams: { page: 1, per_page: this.currentPerPage, search: this.currentSearchText } })
  }

  getOrders() {
    this.loading = true;
    this.orderService
      .getOrders()
      .takeWhile(() => this.alive)
      .subscribe(res => {
        this.orders = res;
        this.dtTrigger.next();
        this.loading = false;
      });
  }

  getOrderByID(id: string) {
    // const order = this.orders.find(t => t.id === id);
    this.loadingGetOrder = true;
    this.orderService.getOrder(id)
        .subscribe(( o: Order ) => {
          this.orderItems = o.order_items;
          this.order_detail = o;
          this.customerSelected = o.customer;
          this.loadingGetOrder = false;
          this.modal.open();
        });
  }

  getTotal(): number {
    return _.sumBy(this.orderItems, "amount");
  }

  payDebt(order_id: string, payment: number) {
    console.log("enter paydebt");
    this.orderService
      .payDebt(order_id, payment)
      .takeWhile(() => this.alive)
      .subscribe((order: Order) => {
        Object.assign(this.orders.find((e: Order) => e.id === order_id), order);
        this.orderItems = order.order_items;
        this.order_detail = order;
        this.toastrService.SetMessageSuccessTranslate("message.pay-debt");
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  print() {
    const lang = localStorage.getItem("lang");
    let printContents, popupWin;
    printContents = document.getElementById("print-section").innerHTML;
    const infoHtml = `
    <div class="widget-box transparent">
      <div class="widget-header widget-header-large">
          <h6 class="widget-title grey lighter">
              <img src="../../assets/img/logo.jpg" alt="">
          </h6>
          <div class="widget-toolbar no-border invoice-info">
              <h4><strong> LIMITED COMPANY VIET KHAI HUNG </strong></h4>
              <h5><em>Distributor of water & electrical equipment, other finishing materials.</em></h5>
          </div>
      </div>

      <div class="widget-header widget-header-large margin-top">
          <span>Add: 19 - Nguyen Cong Tru - Dong Ha - Quang Tri &nbsp &nbsp &nbsp</span>
          <span>   Email: vietkhaihung@gmail.com</span>
          <br />
          <span>Phone: 0944552333 - 02333588333; Fax: 02333. 852890</span>
      </div>

      <div class="widget-body">
          <div class="widget-main">
            <div class="row">
              <div class="col-sm-8 col-xs-8">
                No: 02/ ${this.order_detail.id}/ CN-VKH
              </div>
              <div class="col-sm-4 col-xs-4">
                Dong Ha,
              </div>
            </div>
            <div class="space-6"></div>
            <div class="row">
              <h4 class="text-center"><strong>SALES RECEIPT</strong></h5>
            </div>
            <div class="row">
              <ul class="list-unstyled spaced">
                <li>
                  <h5><strong>Customer's name:</strong> ${
                    this.customerSelected.name
                  }</h5>
                </li>
                <li>
                  <h5><strong>Add:</strong> ${
                    this.customerSelected.address
                  }</h5>
                </li>
                <li>
                  <h5><strong>Phone:</strong> ${
                    this.customerSelected.phone
                  }</h5>
                </li>
              </ul>
            </div>
          </div>
      </div>
    </div>
    `;
    const infoHtmlVi = `
    <div class="widget-box transparent">
      <div class="widget-header widget-header-large">
          <h6 class="widget-title grey lighter">
              <img src="../../assets/img/logo.jpg" alt="">
          </h6>
          <div class="widget-toolbar no-border invoice-info">
              <h4><strong>CÔNG TY TNHH MTV VIỆT KHẢI HƯNG </strong></h4>
              <h5><em>Nhà phân phối vật tư thiết bị điện, nước, vật liệu hoàn thiện khác.</em></h5>
          </div>
      </div>

      <div class="widget-header widget-header-large margin-top">
          <span>Đ/c: Số 19 Nguyễn Công Trứ - Đông Hà - Quảng Trị &nbsp &nbsp &nbsp</span>
          <span>   Email: vietkhaihung@gmail.com</span>
          <br />
          <span>ĐT: 0944552333 - 02333588333; Fax: 02333. 852890</span>
      </div>

      <div class="widget-body">
          <div class="widget-main">
            <div class="row">
              <div class="col-sm-8 col-xs-8">
                Số: 02/ ${this.order_detail.id}/ CN-VKH
              </div>
              <div class="col-sm-4 col-xs-4">
                Đông Hà, ngày &nbsp &nbsp &nbsp tháng &nbsp &nbsp &nbsp năm
              </div>
            </div>
            <div class="space-6"></div>
            <div class="row">
              <h4 class="text-center"><strong>HÓA ĐƠN BÁN HÀNG</strong></h5>
            </div>
            <div class="row">
              <ul class="list-unstyled spaced">
                <li>
                  <h5><strong>Tên khách hàng:</strong> ${
                    this.customerSelected.name
                  }</h5>
                </li>
                <li>
                  <h5><strong>Địa chỉ:</strong> ${
                    this.customerSelected.address
                  }</h5>
                </li>
                <li>
                  <h5><strong>Điện thoại:</strong> ${
                    this.customerSelected.phone
                  }</h5>
                </li>
              </ul>
            </div>
          </div>
      </div>
    </div>
    `;
    const endHtml = `
      <div class="col-sm-6 col-xs-6">
          <div class="row">
            <h5 class="text-center"><strong>THE BUYER</strong></h5>
          </div>
      </div>
      <div class="col-sm-6 col-xs-6">
          <div class="row">
            <h5 class="text-center"><strong>THE SALER</strong></h5>
          </div>
      </div>`;
    const endHtmlVi = `
      <div class="col-sm-6 col-xs-6">
          <div class="row">
            <h5 class="text-center"><strong>BÊN MUA</strong></h5>
          </div>
      </div>
      <div class="col-sm-6 col-xs-6">
          <div class="row">
            <h5 class="text-center"><strong>BÊN BÁN</strong></h5>
          </div>
      </div>`;
    popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
    // popupWin.document.title = "Invoice";
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Invoice #${this.order_detail.id}</title>
          <style>
            html, body {
              border: 1px solid white;
              height: 99%;
            }
            .td-total {
              font-weight: 500;
              font-size: 1.25em;
            }
            .td-price {
              font-size: 1.25em;
              font-weight: 300;
              margin-top: 5px;
            }
            img {
              width: 190px;
              height: 80px;
              margin-bottom: 5px;
            }
            .margin-top {
              margin-top: 10px;
            }
            .right-align {
              text-align: right;
            }
          </style>
          <link href="./assets/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="./assets/font-awesome/css/font-awesome.css" />
          <link rel="stylesheet" href="./assets/dist/css/ace.min.css">
        </head>
        <body onload="window.print();window.close()">
          ${lang === "en" ? infoHtml : infoHtmlVi}
          ${printContents}
          <div class="space-10"></div>
          ${lang === "en" ? endHtml : endHtmlVi}
        </body>
      </html>`);
    popupWin.document.close();
  }
}
