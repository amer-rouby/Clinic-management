import { Injectable } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  constructor(private toastr: NgxToastrService) {}

  /**
   * Show success notification
   * @param message - Message to display
   * @param title - Optional title
   */
  success(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  /**
   * Show error notification
   * @param message - Message to display
   * @param title - Optional title
   */
  error(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  /**
   * Show info notification
   * @param message - Message to display
   * @param title - Optional title
   */
  info(message: string, title?: string): void {
    this.toastr.info(message, title);
  }

  /**
   * Show warning notification
   * @param message - Message to display
   * @param title - Optional title
   */
  warning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }
}
