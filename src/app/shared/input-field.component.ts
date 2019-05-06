import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl
} from '@angular/forms';
import { getUniqueId } from './generate_unique_id';
import * as _ from 'lodash';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html'
})
export class InputFieldComponent implements OnInit {
  public mask = ['(', /\d/, /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  @Input() attribute: string;
  @Input() placeholder: string;
  @Input() icon: string;
  @Input() type = 'text';
  @Input() submitted: boolean;
  @Input() control: FormControl;
  @Input() value: any;
  uniqueId: string;

  ngOnInit() {
    this.uniqueId = getUniqueId();
  }
}
