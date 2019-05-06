import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
import { ToastrService } from '../toastr.service';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
})
export class ToastrComponent implements OnInit {

  constructor(
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private toastrService: ToastrService) {

    this.toastr.setRootViewContainerRef(vcr);
  }
  ngOnInit() {
    this.toastrService.store_message
        .subscribe(toast => {
          if (toast) {
            const message = toast.message;
            switch (toast.type) {
              case 'info':
                this.toastr.info(message);
                break;
              case 'success':
                this.toastr.success(message);
                break;
              case 'warning':
                this.toastr.warning(message);
                break;
              default:
                this.toastr.error(message);
                break;
            }
          }
        })
  }



}
