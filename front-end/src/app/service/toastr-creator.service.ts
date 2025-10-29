import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrCreatorService {

  constructor(private toastr: ToastrService) { }

  showSuccessMessage(message: string, title: string) {
    this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
    this.toastr.success(message, title);
  }

  showErrorMessage(message: string, title: string) {
    this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
    this.toastr.error(message, title);
  }

  showWarningMessage(message: string, title: string) {
    this.toastr.toastrConfig.positionClass = 'toast-bottom-center';
    this.toastr.warning(message, title);
  }
}
