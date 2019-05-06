import { FormControl, FormGroup } from '@angular/forms';

export class MyValidations {
  static cannotContainSpace(control: FormControl) {
    if (control.value.indexOf(' ') >= 0) {
      return { cannotContainSpace: true};
    }
    return null;
  }

  static passwordShouldBeMatched(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('password_confirmation');
    if (password.value === confirmPassword.value) {
      return null;
    }
    return { passwordShouldBeMatched: true };
  }
}
