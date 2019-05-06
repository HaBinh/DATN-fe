import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: '[footer]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  langs: [ { name: 'English', lang: 'en' }, { name: 'Tiếng Việt', lang: 'vi'}];
  defaultValue = 'en';

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.defaultValue = this.translate.getDefaultLang();
  }

  selectCountry(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    window.location.reload();
  }

}
