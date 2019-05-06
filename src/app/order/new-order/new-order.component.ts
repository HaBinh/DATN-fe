import { Component, OnInit, NgZone, Renderer, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder }              from '@angular/forms';
import {Observable}          from 'rxjs/Observable';

import { CustomerService }   from '../../customer/customer.service';
import { OrderService }      from '../order.service';
import { QuotService }       from '../../core/quot.service';
import { ToastrService }     from '../../shared/toastr.service';
import { Customer }          from '../../customer/customer.model';
import { OrderItem }         from '../order-item';
import { Product }           from '../product.model';
import * as _ from 'lodash';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BsModalComponent } from "ng2-bs3-modal";
import { TranslateService } from "@ngx-translate/core";
import { VndPipe } from "../../shared/vnd.pipe";
import { RoundVndPipe } from '../../shared/pipes/round-vnd.pipe';

@Component({
  selector: "app-new-order",
  templateUrl: "./new-order.component.html",
  styleUrls: ["./new-order.component.css"],
  providers: [VndPipe, RoundVndPipe]
})
export class NewOrderComponent implements OnInit {
  @ViewChild("modalEmail") modalQuote: BsModalComponent;
  public config: PerfectScrollbarConfigInterface = {};

  products: Product[] = [];
  customers: Customer[] = [];
  productsSelected: Product[] = [];
  customerSelected: Customer;
  term = "";
  termUser = "";
  stepIndex = 1;
  checked = false;
  form: FormGroup;
  rates: any;
  rated: any[] = [];
  total_sale_price = 0;
  hoc = 0;
  level = 0;
  customer_paid = 0;
  emailQuot = "";
  constructor(
    private ngZone: NgZone,
    private renderer: Renderer,
    private toastrSvc: ToastrService,
    private orderSvc: OrderService,
    private customerSvc: CustomerService,
    private quotSvc: QuotService,
    private translate: TranslateService,
    private vnd: VndPipe,
    private roundVnd: RoundVndPipe,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      name: ["", Validators.required],
      phone: [""],
      email: [""],
      address: [""]
    });
  }

  ngOnInit() {
    this.getStores();
    this.getCustomers();
  }

  setFocus(selector: string): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.renderer.selectRootElement(selector).focus();
      }, 0);
    });
  }

  selectStore(product: Product) {
    if (product.quantity > 0) {
      this.term = "";
      product.quantity_sell = 1;
      product.discounted_rate = 0;
      product.sale_price = product.default_sale_price;
      this.orderSvc.getDiscountRates(product.id).subscribe(rates => {
        this.rates = rates.map(rate => rate.rate);
        this.hoc = this.rates[this.level];
        product.discounted_rate = this.hoc;
        this.rated.unshift(this.rates);
      });
      this.productsSelected.unshift(product);
      this.products = _.reject(this.products, ["id", product.id]);
      this.term = "";
      this.setFocus("#quantity");
    } else {
      this.translate
        .get("message.new-order.missing-goods", product)
        .subscribe(res => {
          this.toastrSvc.SetMessageError(res);
        });
    }
  }

  selectCustomer(customer: Customer) {
    this.customerSelected = customer;
    this.termUser = "";
    this.checked = true;
    this.level = customer.level;
  }

  removeInOrder(product: Product) {
    this.products.push(product);
    this.productsSelected = _.reject(this.productsSelected, ["id", product.id]);
  }

  addCustomer() {
    this.customerSelected = _.pickBy(this.form.value);
    this.checked = false;
  }

  addOrder(value: number) {
    if (!this.customerSelected) {
      this.toastrSvc.SetMessageInfoTranslate(
        "message.new-order.choose-customer"
      );
      return;
    }
    const orderItems = _.map(this.productsSelected, (product: Product) => {
      return new OrderItem(
        product.id,
        product.quantity_sell,
        product.sale_price,
        product.discounted_rate
      );
    });

    const customer_paid = value;

    let result = {
      order_items: orderItems
    };
    if (this.checked) {
      result = _.assign(result, {
        order: {
          customer_id: this.customerSelected.id,
          customer_paid: customer_paid
        }
      });
    } else {
      let customer_info = _.pickBy(this.form.value);
      customer_info = _.assign(customer_info, { customer_paid: customer_paid });
      result = _.assign(result, { order: customer_info });
    }
    this.orderSvc.addOrder(result).subscribe(
      res => {
        this.toastrSvc.SetMessageSuccessTranslate(
          "message.new-order.created-order"
        );
        this.customerSelected = null;
        this.productsSelected = [];
        this.getCustomers();
        this.getStores();
        this.term = "";
      },
      err => {
        const error_info = JSON.parse(err._body);
        this.translate
          .get(error_info.key_message, error_info.params)
          .subscribe(res => {
            this.toastrSvc.SetMessageError(res);
          });
      }
    );
  }

  printQuot() {
    const lang = localStorage.getItem("lang");
    let printContents, popupWin;

    printContents = this.getContentHtml();

    popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Bao gia san pham</title>
          <style>
            html, body {
              border: 1px solid white;
              height: 99%;
            }
            img {
              width: 190px;
              height: 80px;
              margin-bottom: 5px;
            }
            .margin-top {
              margin-top: 10px;
            }
          </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          <link rel="stylesheet" href="./assets/font-awesome/css/font-awesome.css" />
          <link rel="stylesheet" href="./assets/dist/css/ace.min.css">
        </head>
        <body onload="window.print();window.close()">
            ${printContents}
        </body>
      </html>`);
    popupWin.document.close();
  }

  sendQuot(email: string) {
    let printContents = this.getContentHtml();
    const value = {
      email: email,
      code_html: printContents
    };
    this.toastrSvc.SetMessageInfoTranslate("message.new-order.sending-mail");
    this.modalQuote.close();
    this.quotSvc.sendQuot(value).subscribe(
      res => {
        this.toastrSvc.SetMessageSuccessTranslate(
          "message.new-order.sent-mail"
        );
      },
      err => {
        const parsed_errors = JSON.parse(err._body).message;
        this.toastrSvc.SetMessageWarning(parsed_errors);
      }
    );
  }

  sale_price(product: Product): number {
    return product.quantity_sell * this.roundVnd.transform(
        product.sale_price *
        (1 - product.discounted_rate));
  }

  getTotal(): number {
    return _.sumBy(this.productsSelected, (p: Product) => this.sale_price( p ));
  }

  paid(): number {
    this.customer_paid = this.getTotal();
    return this.customer_paid;
  }

  private getStores() {
    this.orderSvc.getProducts().subscribe(products => {
      // console.log(products);
      this.products = products;
    });
  }

  private getCustomers() {
    this.customerSvc
      .getCustomersWithObservable()
      .subscribe(
        customers =>
          (this.customers = customers.filter(cus => cus.active !== false))
      );
  }

  private getContentHtml() {
    // tslint:disable-next-line:max-line-length
    let infoHtmlVi = `<div class="widget-box transparent">
      <div class="widget-header widget-header-large transparent">
          <h6 class="widget-title grey lighter">
            <img src="http://sv1.upsieutoc.com/2017/11/16/logo09542f38a8977863.jpg" alt="logo09542f38a8977863.jpg" border="0" />
          </h6>
          <div class="widget-toolbar no-border invoice-info">
              <h4><strong>CÔNG TY TNHH MTV VIỆT KHẢI HƯNG </strong></h4>
              <h5><em>Nhà phân phối vật tư thiết bị điện, nước, vật liệu hoàn thiện khác.</em></h5>
          </div>
      </div>

      <div class="widget-header widget-header-large margin-top transparent">
          <span>Đ/c: Số 19 Nguyễn Công Trứ - Đông Hà - Quảng Trị</span>
          <br />
          <span>ĐT: 0944552333 - 02333588333; Fax: 02333. 852890</span>
          <br/>
          <span>   Email: vietkhaihung@gmail.com</span>
      </div>

      <div class="widget-body">
          <div class="widget-main">
            <div class="space-6"></div>
            <div class="row">
              <h4 class="text-center"><strong>BÁO GIÁ SẢN PHẨM</strong></h5>
            </div>
            <div class="row">
              <h5>Kính gửi: Quý khách hàng</h5>
            </div>
          </div>
      </div>
    </div>
    `;
    let printContents = `
      <div class="" id="print-section">
        <div class="">
          <table id="simple-table" class="table table-striped table-bordered table-hover dataTable no-footer" cellspacing="0" width="100%">
            <thead>
              <tr>
                <th>Mã sản phẩm</th>
                <th>Tên</th>
                <th class="right-align">Số lượng</th>
                <th class="right-align">Giá hãng</th>
                <th class="right-align">Chiết khấu</th>
                <th class="right-align">Giá bán</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>`;
    for (let i = 0; i < this.productsSelected.length; i++) {
      printContents += `
              <tr>
                <td>${this.productsSelected[i].code}</td>
                <td>${this.productsSelected[i].name}</td>
                <td class="right-align"> ${
                  this.productsSelected[i].quantity_sell
                } </td>
                <td class="right-align"> ${this.vnd.transform(
                  this.productsSelected[i].sale_price
                )} </td>
                <td class="right-align"> ${this.productsSelected[i]
                  .discounted_rate * 100} % </td>
                <td class="right-align">
                  ${this.vnd.transform(this.roundVnd.transform(
                    this.productsSelected[i].sale_price *
                      (1 - this.productsSelected[i].discounted_rate))
                  )}
                </td>
                <td class="right-align"> ${this.vnd.transform(this.roundVnd.transform(
                  this.sale_price(this.productsSelected[i]))
                )}
                </td>
              </tr>`;
    }
    printContents += `
              <tr>
                <td colspan="6">
                  <h6 class="text-center"><strong> Tổng cộng </strong></h6>
                </td>
                <td id="total" colspan="2">
                  <h5>${this.vnd.transform(this.getTotal())}</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    return infoHtmlVi + printContents;
  }
}
