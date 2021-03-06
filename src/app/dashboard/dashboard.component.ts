import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { DashboardService } from './dashboard.service';
import { ChartsModule } from 'ng2-charts';
import { VndPipe } from "../shared/vnd.pipe";
import { RoundVndPipe } from "../shared/pipes/round-vnd.pipe";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  providers: [DashboardService, VndPipe, RoundVndPipe]
})
export class DashboardComponent implements OnInit {
  results: any;
  profit: any;
  imported_price: any;
  total_amount: any;
  total_profit: any;
  total_expenditure: any;
  total_revenue: any;

  total_profit_month: any;
  total_expenditure_month: any;
  total_revenue_month: any;

  total_profit_week: any;
  total_expenditure_week: any;
  total_revenue_week: any;

  total_inventory: any;
  total_sales: any;
  check = 0;
  public pieChartLabels: string[];
  public pieChartData: number[] = [0, 0];
  public pieChartType = "pie";
  public pieChartOption: any;

  public barChartOptions: any;
  public barChartLabels: string[];
  public barChartType = "bar";
  public barChartLegend = true;
  public barChartData: any;
  public barChartDataMonth: any;
  public barChartLabelsMonth: string[];
  public barChartDataWeek: any;
  public barChartLabelsWeek: string[];

  loading: boolean;

  constructor(
    private http: Http,
    private dashboardService: DashboardService,
    private vnd: VndPipe,
    private roundVnd: RoundVndPipe
  ) {}

  ngOnInit() {
    this.loading = true;
    const self = this;
    this.pieChartOption = {
      tooltips: {
        callbacks: {
          label: function(tooltipItems, data) {
            const amount = self.vnd.transform(
              self.roundVnd.transform(data.datasets[0].data[tooltipItems.index])
            );
            return data.labels[tooltipItems.index] + ": " + amount;
          }
        }
      }
    };
    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      tooltips: {
        callbacks: {
          label: function(tooltipItems, data) {
            const amount = self.vnd.transform(self.roundVnd.transform(tooltipItems.yLabel));
            return  data.datasets[tooltipItems.datasetIndex].label + ": " + amount;
          }
        } } };
    this.dashboardService.getResults().subscribe(results => {
      this.barChartLabels = results[2].profit.map(month => month.month);
      this.total_profit = results[2].profit.map(total => total.total);
      this.total_expenditure = results[0].imported_price.map(total => total.total);
      this.total_revenue = results[1].total_amount.map(total => total.total);

      this.barChartLabelsMonth = results[8].profit_month.map(val => val.day);
      this.total_profit_month = results[8].profit_month.map(total => total.total);
      this.total_expenditure_month = results[6].imported_price_month.map(total => total.total);
      this.total_revenue_month = results[7].total_amount_month.map(total => total.total);

      this.barChartLabelsWeek = results[11].profit_week.map(val => val.day);
      this.total_profit_week = results[11].profit_week.map(total => total.total);
      this.total_expenditure_week = results[9].imported_price_week.map(total => total.total);
      this.total_revenue_week = results[10].total_amount_week.map(total => total.total);

      this.total_inventory = results[3].inventory.map(total => total.total);
      this.total_sales = results[4].sales.map(total => total.total);
      this.chart(
        this.total_expenditure,
        this.total_revenue,
        this.total_profit,
        this.total_expenditure_month,
        this.total_revenue_month,
        this.total_profit_month,
        this.total_expenditure_week,
        this.total_revenue_week,
        this.total_profit_week,
        this.total_inventory,
        this.total_sales
      );
      this.loading = false;
    });
  }

  chart(
    total_expenditure,
    total_revenue,
    total_profit,
    total_expenditure_month,
    total_revenue_month,
    total_profit_month,
    total_expenditure_week,
    total_revenue_week,
    total_profit_week,
    total_inventory,
    total_sales
  ) {
    this.check = 1;
    this.pieChartData = [total_inventory[0], total_sales[0]];
    const lang = localStorage.getItem("lang");
    if (lang === "en") {
      this.barChartData = [
        { data: total_expenditure, label: "Total Expenditure" },
        { data: total_revenue, label: "Total Revenue" },
        { data: total_profit, label: "Total Profit" }
      ];
      this.barChartDataMonth = [
        { data: total_expenditure_month, label: "Total Expenditure" },
        { data: total_revenue_month, label: "Total Revenue" },
        { data: total_profit_month, label: "Total Profit" }
      ];
      this.barChartDataWeek = [
        { data: total_expenditure_week, label: "Total Expenditure" },
        { data: total_revenue_week, label: "Total Revenue" },
        { data: total_profit_week, label: "Total Profit" }
      ];
      this.pieChartLabels = ["Inventory Amount", "Saled Amount"];
    } else {
      this.barChartData = [
        { data: total_expenditure, label: "Tổng Chi" },
        { data: total_revenue, label: "Tổng Thu" },
        { data: total_profit, label: "Tổng Lợi Nhuận" }
      ];
      this.barChartDataMonth = [
        { data: total_expenditure_month, label: "Tổng Chi" },
        { data: total_revenue_month, label: "Tổng Thu" },
        { data: total_profit_month, label: "Tổng Lợi Nhuận" }
      ];
      this.barChartDataWeek = [
        { data: total_expenditure_week, label: "Tổng Chi" },
        { data: total_revenue_week, label: "Tổng Thu" },
        { data: total_profit_week, label: "Tổng Lợi Nhuận" }
      ];
      this.pieChartLabels = ["Tổng Hàng Tồn Kho", "Tổng Hàng Bán Ra"];
    }
  }

  public pieChartHovered(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

  public chartClicked(e: any): void {
    console.log(e);
  }
}
