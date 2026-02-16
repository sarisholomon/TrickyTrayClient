import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payment-component.html',
  styleUrls: ['./payment-component.scss']
})
export class PaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  submitted = false;

  @Output() purchaseCompleted = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      saveCard: [false],
      country: [{ value: 'Israel', disabled: false }],
      city: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.paymentForm.valid) {
      this.cartService.checkOut().subscribe({
        next: () => {
          this.purchaseCompleted.emit();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'שגיאה',
            detail: 'אירעה שגיאה במהלך ביצוע הרכישה',
            life: 4000
          });
        }
      });
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

  hasError(controlName: string): boolean {
    const control = this.paymentForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }
}