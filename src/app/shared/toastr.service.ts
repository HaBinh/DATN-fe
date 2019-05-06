import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class ToastrService {
  private message = new BehaviorSubject<any>(null);
  store_message = this.message.asObservable();
  constructor(
    public toastr: ToastsManager,
    private translate: TranslateService
  ) {}

  SetMessage(message: string, type = "info") {
    this.message.next({ message, type });
  }

  SetMessageSuccess(message: string) {
    this.toastr.success(message);
  }

  SetMessageWarning(message: string) {
    this.toastr.warning(message, "Alert!");
  }

  SetMessageError(message: string) {
    this.toastr.error(message);
  }

  SetMessageInfo(message: string) {
    this.toastr.info(message);
  }

  SetMessageSuccessTranslate(message: string) {
    this.translate.get(message).subscribe((res: string) => {
      this.SetMessageSuccess(res);
    });
  }

  SetMessageInfoTranslate(message: string) {
    this.translate.get(message).subscribe((res: string) => {
      this.SetMessageInfo(res);
    });
  }

  SetMessageErrorTranslate(message: string) {
    this.translate.get(message).subscribe((res: string) => {
      this.SetMessageError(res);
    });
  }
}
