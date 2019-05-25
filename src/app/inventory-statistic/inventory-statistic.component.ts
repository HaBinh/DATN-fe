import { Component, OnInit } from '@angular/core';
import { StoreService } from 'app/store/store.service';
import { Inventory } from 'app/store/inventory.model';
import {getLangUrl} from "../shared/get_url_lang";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-inventory-statistic',
  templateUrl: './inventory-statistic.component.html',
  styleUrls: ['./inventory-statistic.component.css']
})
export class InventoryStatisticComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  listInventories: Inventory[] = [];

  constructor(
    private storeService: StoreService,
  ) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      language: {
        url: getLangUrl()
      }
    };
    this.getInventory();
  }

  getInventory() {
    this.storeService.get_inventory_statisitc()
      .subscribe(listInventories => {
        this.listInventories = listInventories;
        console.log(this.listInventories);
        this.dtTrigger.next();
      });
  }

}
