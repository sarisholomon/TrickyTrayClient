import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// ייבוא רכיבי PrimeNG (לוודא שאין שגיאות כתיב כאן!)
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  // 1. כאן אנחנו מזריקים את הכלים של PrimeNG לתוך הקומפוננטה
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    InputTextModule, 
    ButtonModule, 
    PasswordModule, 
    MessageModule, 
    CardModule
  ],
  templateUrl: './login.html', // לוודא ששם הקובץ במערכת שלך הוא אכן login.html
  styleUrls: ['./login.scss']  // לוודא ששם הקובץ במערכת שלך הוא אכן login.scss
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // המשתנה שמנהל את הטופס
  errorMessage: string = ''; // הודעת שגיאה שתגיע מהשרת

  constructor(
    private fb: FormBuilder,        
    private authService: AuthService, 
    private router: Router          
  ) {}

  ngOnInit(): void {
    // הגדרת השדות: אימייל (חובה + מבנה אימייל) וסיסמה (חובה)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.router.navigate(['/']); // הצלחה! עוברים דף
        },
        error: (err) => {
          this.errorMessage = 'פרטי התחברות שגויים'; // כישלון
        }
      });
    }
  }
}