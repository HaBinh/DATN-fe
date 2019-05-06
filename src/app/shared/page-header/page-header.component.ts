import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'page-header',
  templateUrl: './page-header.component.html'
})

export class PageHeaderComponent {
  @Input() title: string;
  @Input() smallTitle: string = 'nothing';
}
