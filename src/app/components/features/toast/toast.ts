import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class ToastContainer {
  constructor(public toastService: ToastService) {}

  get toasts$() {
    return this.toastService.toasts$;
  }
}
