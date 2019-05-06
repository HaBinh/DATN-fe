import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl
} from '@angular/forms';
import { ToastrService } from "../../shared/toastr.service";

import { BsModalComponent } from "ng2-bs3-modal";
import { getLangUrl }           from '../../shared/get_url_lang';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { User, UsersService }   from '../';

import * as _ from 'lodash';

@Component({
  selector: "users-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"]
})
export class IndexComponent implements OnInit {
  @ViewChild("modal") modal: BsModalComponent;
  @ViewChild("modalUpdate") modalUpdate: BsModalComponent;
  @ViewChild("modalConfirm") modalConfirm: BsModalComponent;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  getUsers$: any;
  users: User[] = [];
  form: FormGroup;
  updateForm: FormGroup;
  role = false;
  currentRole = false;
  selectedId: string;
  showAlert = false;
  emailJustAdded = "";
  passwordJustAdded = "";
  remove_user_id: string;
  remove_user_name: string;
  loading: boolean;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private toastSvc: ToastrService
  ) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      language: {
        url: getLangUrl()
      }
    };
    this.getUsers();
    this.buildForm();
  }

  getUsers() {
    this.loading = true;
    this.getUsers$ = this.usersService.getUsers();
    this.getUsers$.subscribe(users => {
      this.users = users;
      this.dtTrigger.next();
      this.loading = false;
    });
  }

  addUser(value: any) {
    console.log(this.role);
    const signUpData = {
      email: value.email,
      name: value.name,
      password: value.password,
      password_confirmation: value.password_confirmation,
      role: this.role ? "manager" : "staff"
    };

    this.usersService.addUser(signUpData).subscribe(user => {
      this.users.push(user);
      this.modal.close();
      this.emailJustAdded = value.email;
      this.passwordJustAdded = value.password;
      this.showAlert = true;
      this.form.reset();
    });
  }

  buildForm() {
    this.form = this.fb.group(
      {
        email: [
          "",
          Validators.compose([Validators.email]),
          this.validateEmailNotTaken.bind(this)
        ],
        name: ["", Validators.required],
        password: [
          "",
          Validators.compose([Validators.required, Validators.minLength(8)])
        ],
        password_confirmation: ["", Validators.required],
        role: [false]
      },
      { validator: this.passwordConfirming }
    );

    this.updateForm = this.fb.group({
      name: ["", Validators.required]
    });
  }

  selectUpdate(id: string) {
    let userSelected: User = this.users.find(user => user.id === id);
    this.updateForm.setValue({
      name: userSelected.name
    });
    this.selectedId = userSelected.id;
    this.currentRole = userSelected.role === "manager";
    this.modalUpdate.open();
  }

  updateUser(value: any) {
    let data = {
      id: this.selectedId,
      name: value.name,
      role: this.currentRole ? "manager" : "staff"
    };

    this.usersService.updateUser(data).subscribe(data => {
      _.assign(this.users.find(user => user.id === data.id), data);
      this.modalUpdate.close();
    });
  }

  openModalRemoveAccount(user: User) {
    this.remove_user_id = user.id;
    this.remove_user_name = user.name;
    this.modalConfirm.open();
  }

  removeAccount() {
    this.modalConfirm.close();
    this.usersService.removeUser(this.remove_user_id).subscribe(() => {
      this.users = _.reject(this.users, ["id", this.remove_user_id]);
      this.toastSvc.SetMessageSuccessTranslate("message.delete-success");
    });
  }

  // Validate form

  passwordConfirming(c: AbstractControl) {
    if (c.get("password").value !== c.get("password_confirmation").value) {
      return { passwordShouldBeMatched: true };
    }
    return null;
  }

  validateEmailNotTaken(control: AbstractControl) {
    return this.getUsers$
      .map(users => users.filter(user => user.email === control.value))
      .map(users => !users.length)
      .map(res => {
        return res ? null : { emailTaken: true };
      });
  }
}
