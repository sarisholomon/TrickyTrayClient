import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    InputTextModule, 
    ButtonModule, 
    PasswordModule, 
    MessageModule, 
    CardModule
  ],
  templateUrl: './login.html', 
  styleUrls: ['./login.scss'] 
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; 
  errorMessage: string = ''; 
public router = inject(Router);
  constructor(
    private fb: FormBuilder,        
    private authService: AuthService, 
  ) {}

  ngOnInit(): void {
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
          if(this.authService.isAdmin())
          this.router.navigate(['/dashboard']); 
        else          
         this.router.navigate(['/gifts']); 

        },
        error: (err) => {
          this.errorMessage = 'פרטי התחברות שגויים';
        }
      });
    }
  }
}