import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  PipeTransform,
  Pipe
} from '@angular/core';

import { IndexComponent } from './index.component';
import { By } from "@angular/platform-browser";
import { FormBuilder } from "@angular/forms";
import { ModalComponent }       from 'ng2-bs3-modal/ng2-bs3-modal';

import { click, advance } from "../../../testing";
import { DataTablesModule } from "angular-datatables";
import { Observable } from "rxjs/Rx";
import * as _ from "lodash";
import { User, UsersService } from '../';

const USERS: User[] = [
  new User('1', 'admin@admin.com', 'admin', 'manager'),
  new User('2', 'staff@staff.com', 'staff', 'staff'),
];

const newUser: User = new User('3', 'thuan@gmail.com', 'admin', 'manager');

class UsersServiceSpy {
  users = USERS;
  getUsers = jasmine
    .createSpy("getUsers")
    .and.returnValue(Observable.of(this.users));

  addUser = jasmine
    .createSpy("addUser")
    .and.returnValue(Observable.of(newUser));
}


@Pipe({
  name: 'translate'
})
class TranslatePipeMock implements PipeTransform {
  public name: string = 'translate';

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let userStub: UsersServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DataTablesModule],
      declarations: [IndexComponent, TranslatePipeMock, ModalComponent],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(IndexComponent, {
      set: {
        providers: [
          { provide: UsersService, useClass: UsersServiceSpy }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    component.dtTrigger.complete();
    userStub = fixture.debugElement.injector.get(UsersService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("Text validate form ", () => {
    beforeEach(() => {
      let firstUser = USERS[0];
      component.form.setValue({
        name: firstUser.name,
        email: firstUser.email,
        password: 'thuan274',
        password_confirmation: 'thuan274',
        role: false
      });
    });

    it('invalid form when email has already taken', () => {
      fixture.detectChanges();
      expect(component.form.invalid).toBeTruthy();
    });
  });

  describe("Call get all users ", () => {

    beforeEach(() => {
      // component.getUsers();
    });

    it('shoudl called get users', () => {
      expect(userStub.getUsers.calls.count()).toBe(1, 'getUsers called once');
    });
    it('should have 2 users', () => {
      expect(component.users.length).toBe(USERS.length);
    });

    it('should render users ', () => {
      const tdf = fixture.debugElement.query(By.css('td')).nativeElement;
      expect(fixture.debugElement.query(By.css("td")).nativeElement.innerText).toBe(USERS[0].name);
    });
  });

  describe("Test add new user", () => {
    let spyModal: any;
    beforeEach(() => {
      component.form.setValue({
        name: newUser.name,
        email: newUser.email,
        password: "thuan274",
        password_confirmation: "thuan274",
        role: false
      });

      component.role = true; // set new user will be a manager

      let modalCreate = component.modal;
      spyModal = spyOn(modalCreate, "close");
      const btnCreate = fixture.debugElement.query(By.css('#btn-create-user'));
      click(btnCreate);
      fixture.detectChanges();
    });

    it('should called modal close after choose btn create', () => {
      expect(spyModal).toHaveBeenCalled();
    });

    it('shoudle called add user in users service', () => {
      expect(userStub.addUser.calls.count()).toBe(1);
    });

    it('should add new user to user property', () => {
      expect(component.users.findIndex(user => user.name === newUser.name)).toBeGreaterThan(-1);
    });

  });
});
