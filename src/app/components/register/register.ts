import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// רכיבי PrimeNG שצריך לייבא
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    InputTextModule, 
    ButtonModule, 
    PasswordModule, 
    CardModule, 
    MessageModule,
    InputMaskModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
public router = inject(Router);
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
  ) {}

  // ngOnInit(): void {
  //   this.registerForm = this.fb.group({
  //     // התאמה לשדות ב-CreateUserAsync בשרת
  //     firstName: ['', [Validators.required]],
  //     lastName: ['', [Validators.required]],
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(6)]],
  //     phone: ['', [Validators.required]] // השדה נקרא phone ב-DTO שלך
  //   });
  // }
// הוספנו את ה-Validators המורחבים
ngOnInit(): void {
  this.registerForm = this.fb.group({
    firstName: ['', [
      Validators.required, 
      Validators.minLength(2), 
      Validators.pattern('^[a-zA-Zא-ת ]+$') // רק אותיות (עברית/אנגלית)
    ]],
    lastName: ['', [
      Validators.required, 
      Validators.minLength(2), 
      Validators.pattern('^[a-zA-Zא-ת ]+$')
    ]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(6),
      // ולידציה לסיסמה: לפחות אות גדולה, אות קטנה ומספר
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')
    ]],
    phone: ['', [Validators.required]]
  });
}
  onRegister(): void {
    if (this.registerForm.valid) {
      // שליחת הנתונים ל-API
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          console.log('User registered successfully');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // טיפול בשגיאה כמו "Email already registered" שזורק ה-UserService
          this.errorMessage = err.error?.message || 'חלה שגיאה ברישום המשתמש';
        }
      });
    }
  }
}