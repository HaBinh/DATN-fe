import {
  Component,
  OnInit,
  Output,
  EventEmitter }             from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder }              from '@angular/forms';
import {Observable}          from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

import { MyValidations }     from '../my-validations';
import { AuthService }       from '../auth.service';
import {TranslateService}    from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  remember = false;
  isLoading = false;

  @Output() onFormResult = new EventEmitter<any>();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private translateSvc: TranslateService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([
          Validators.required,
          MyValidations.cannotContainSpace
        ])],
      remember: [false]
    });
  }

  submit(value: any) {
    this.toggleLoading();
    this.authService.logIn(value.email, value.password, value.remember)
      .subscribe(
        res => {
          if (res.status === 200) {
            this.onFormResult.emit({signedIn: true, res});
            this.isLoading = false;
          }
          this.isLoading = false;
        },
        err => {
          this.afterFailedLogin(err);
          console.log('err:', err);
          this.onFormResult.emit({signedIn: false, err});
          this.isLoading = false;
        }
    );
  }

  afterFailedLogin(errors: any) {
    // this.toggleLoading();
    const parsed_errors = JSON.parse(errors._body).errors;
    for (const attribute in this.loginForm.controls) {
      if (parsed_errors[attribute]) {
        this.loginForm.controls[attribute].setErrors(parsed_errors[attribute]);
      }
    }
    this.loginForm.setErrors(parsed_errors);
  }

  changeLang(lang: string) {
    this.translateSvc.use(lang);
    localStorage.setItem('lang', lang);
  }

  private toggleLoading() {
    this.isLoading = !this.isLoading;
  }
}
