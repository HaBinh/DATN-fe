import { Component, OnInit } from "@angular/core";
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

import { RateService } from "./rate.service";
import { Rate } from "./rate.model";
import { ChartsModule } from 'ng2-charts';
import { Product } from '../products/product.model';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css'],
  providers: [RateService]
})
export class RateComponent implements OnInit {
  formEdit: FormGroup;
  formAdd: FormGroup;
  newRate: Rate = new Rate();
  rates: Rate[];
  products: Product[];
  lists: Array<any> = [];
  editing = -1;
  adding = -1;
  tam = 1;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private http: Http,
    private rateService: RateService,
    fb: FormBuilder
  ) {
    this.formEdit = fb.group({
      newRate: ['', Validators.compose([Validators.required])]
    });
    this.formAdd = fb.group({
      newRateAdd: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };

    this.rateService.getRates().subscribe(rates => {
      this.rates = rates;
    });
  }

  deleteRate(rate: Rate) {

    this.rateService
        .deleteRate(rate)
        .then(() => {
          this.rates = this.rates.filter(v => v.id !== rate.id);
        });
  }

  changeToEdit(rate: Rate, event: any) {
    // let disposable = this.dialogService.addDialog(CustomerFormComponent);
    this.editing = rate.id;
    this.tam  = rate.rate  * 100  ;
  }

  editRate(value: any, rate: Rate, event: any) {
    if (value.newRate === '' || value.newRate === null) {
      value.newRate = rate.rate * 100;
    }
    this.rateService.updateRate(value, rate).then(() => {
      this.rates.find(res => res.id === rate.id).rate = value.newRate / 100;
      this.revertEdit();
      this.formEdit.reset();
    });
  }

  getRates() {

  }

  revertEdit() {
    this.editing = -1;
  }

  changeToAdd() {
    this.adding = 1;
  }

  addRate(value: any) {
    this.revertAdd();
    this.rateService.addRate(value).then(res => {
      this.newRate = res.json().rate;
      this.rates.push(this.newRate);
      this.newRate = new Rate();
    });
  }

  revertAdd() {
    this.adding = -1;
  }

  keyDownFunction(value, event) {

    if (event.keyCode === 13) {
      this.addRate(value);
    }
  }
}
