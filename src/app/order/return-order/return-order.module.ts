import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReturnOrderComponent } from './return-order.component';

import { SharedModule } from "../../shared/shared.module";

export const UsersRoutes: Routes = [
  {
    path: "",
    component: ReturnOrderComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(UsersRoutes),
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [ReturnOrderComponent]
})
export class ReturnOrderModule {}
