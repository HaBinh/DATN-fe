import {Component, OnInit} from '@angular/core';
import {BestSellerModel} from "./best-seller.model";
import {Subject} from "rxjs/Subject";
import {ProductsService} from "../core/products.service";
import {getLangUrl} from "../shared/get_url_lang";

@Component({
  selector: 'app-products-best-seller',
  templateUrl: './products-best-seller.component.html',
  styleUrls: ['./products-best-seller.component.css']
})
export class ProductsBestSellerComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  listBestSeller: BestSellerModel[] = [];


  constructor(
    private productService: ProductsService,
  ) {
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      language: {
        url: getLangUrl()
      },
      order: []
    };

    this.getListBestSeller();
  }

  getListBestSeller() {
    this.productService.get_products_best_seller()
      .subscribe(list => {
        this.listBestSeller = list;
        this.dtTrigger.next();
      });
  }


}
