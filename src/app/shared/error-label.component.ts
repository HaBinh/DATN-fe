import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl
} from '@angular/forms';

@Component({
  selector: "app-error-label",
  template: `
    <ng-container *ngIf="control.errors && (control.dirty || control.touched)" class="alert alert-danger">
      <div class="has-error">
        <div *ngFor="let error of (control.errors | errorMessages)" class="help-block">
          {{ error }}
        </div>
      </div>
    </ng-container>
  `,
  styles: [".alert:last-child { margin-bottom: 10px; }"]
})
export class ErrorLabelComponent implements OnInit {
  @Input() control: FormControl;
  @Input() submitted: boolean;

  ngOnInit() {}
}
