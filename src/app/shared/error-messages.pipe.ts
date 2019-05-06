import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Pipe({ name: 'errorMessages' })
export class ErrorMessagesPipe implements PipeTransform {

  constructor(
    private translate: TranslateService
  ) {}

  transform(value: Object): Array<string> {
    if (Array.isArray(value)) {
      return value;
    }

    return this.parseErrorObject(value);
  }

  private parseErrorObject(value: Object): Array<string> {
    let errors = [];
    for (const key in value) {
      if (this.knownErrors()[key]) {
        const error_messages = this.knownErrors()[key].call(this, value[key]);
        errors = errors.concat(error_messages);
      }
    }
    return errors;
  }

  private knownErrors(): Object {
    return {
      pattern: this.patternError,
      minlength: this.minLengthError,
      maxlength: this.maxLengthError,
      min: this.minValueError,
      email: this.emailNotCorrect,
      required: this.requiredError,
      full_messages: this.fullMessages,
      cannotContainSpace: this.cannotContainSpace,
      passwordShouldBeMatched: this.shouldBeMatched,
      emailTaken: this.existingEmail,
      codeTaken: this.existingCodeProduct
    };
  }

  private existingCodeProduct(_error): string {
    return this.translate.instant('message.forms.code-product-taken');
  }

  private shouldBeMatched(_error): string {
    return this.translate.instant('message.forms.should-be-matched');
  }

  private existingEmail(_error): string {
    return this.translate.instant("message.forms.existing-email");
  }

  private emailNotCorrect(_error): string {
    return this.translate.instant("message.forms.email-not-correct");
  }

  private cannotContainSpace(_error): string {
    return this.translate.instant("message.forms.cannot-contain-space");
  }

  private minValueError(error): string {
    return this.translate.instant("message.forms.min-value-error", {value: error['min']});
  }

  private patternError(error): string {
    return `Must match /${error['requiredPattern']}/ pattern`;
  }

  private maxLengthError(error): string {
    return this.translate.instant("message.forms.max-length-error", {
      value: error["requiredLength"] + 1
    });
  }

  private minLengthError(error): string {
    return this.translate.instant("message.forms.min-length-error", {
      value: error["requiredLength"] - 1
    });
  }

  private requiredError(_error): string {
    return this.translate.instant('message.forms.required');
  }

  private fullMessages(error): Array<string> {
    return error;
  }
}
