import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { VndPipe } from '../../shared/vnd.pipe';
import { Order, OrderItem, OrderService, Customer, Product } from '../';
import { ToastrService } from '../../shared/toastr.service';
import * as _ from 'lodash';

@Pipe({ name: 'Return' })
export class ReturnPipe implements PipeTransform {
  transform(orderItems: OrderItem[]) {
    return orderItems.filter(item => item.quantity === 0);
  }
}

@Component({
  selector: "app-return-order",
  templateUrl: "./return-order.component.html",
  styleUrls: ["./return-order.component.css"],
  providers: [VndPipe]
})
export class ReturnOrderComponent implements OnInit {
  term = "";
  orderSearch: Array<any> = [];
  orderItems: OrderItem[] = [];
  orderSelected: Order;
  loadingGetOrder = false;
  response: any;
  showAlert = false;

  constructor(
    private orderService: OrderService,
    private toastrService: ToastrService,
    private vndPipe: VndPipe) {}

  ngOnInit() {
    this.getOrders();
  }

  selectOrder(order_id: string) {
    this.toggleLoadingGetOrder();
    this.term = "";
    this.orderService.getOrder(order_id).subscribe(order => {
      this.orderSelected = order;
      this.orderItems = order.order_items;
      this.orderItems.map(item => _.assign(item, { old_quantity: item.quantity }));
      this.toggleLoadingGetOrder();
    });
  }

  getTotal(): number {
    return _.sumBy(this.orderItems, (item: OrderItem)=> {
      return item.amount / item.old_quantity * (item.quantity);
    });
  }

  removeItem(item: OrderItem) {
    item.quantity = 0;
  }

  returnOrder() {
    const orderItems = _.map(this.orderItems, item => {
      return new Object({ id: item.id, quantity_return: item.old_quantity - item.quantity });
    });

    const result = {
      order_items: orderItems,
    };
    let order_id = this.orderSelected.id;
    if (_.findIndex(result.order_items, item => item.quantity_return < 0) > -1) {
      this.toastrService.SetMessageErrorTranslate("message.return-order.quantity-return");
    } else {
    this.orderService
      .returnOrder(order_id, result)
      .subscribe(res => {
        this.response = _.assign(this.response, {
          id: res.id,
          total_amount: this.vndPipe.transform(res.total_amount),
          paid_return_user: this.vndPipe.transform(res.paid_return_user),
          debt: this.vndPipe.transform(res.debt)
        });
        this.toastrService.SetMessageSuccessTranslate("message.return-order.return-success");
        this.showAlert = true;
      });
    }
  }

  private getOrders() {
    this.orderService.getSearchOrder().subscribe(res => {
      this.orderSearch = res;
    });
  }

  private toggleLoadingGetOrder() {
    this.loadingGetOrder = !this.loadingGetOrder;
  }
}
