import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';

import { UsersRoutes } from './users.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(UsersRoutes),
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [IndexComponent]
})
export class UsersModule { }
