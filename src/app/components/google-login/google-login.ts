import { ChangeDetectorRef, Component, NgZone, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { AuthService, LoginResponse } from '../../services/auth-service';

@Component({
  selector: 'app-google-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './google-login.html',
  styleUrls: ['./google-login.scss'],
})
export class GoogleLoginComponent implements OnInit {
  private socialAuthService = inject(SocialAuthService);
  private http = inject(HttpClient);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user: SocialUser | null) => {
      if (!user) {
        return;
      }

      const idToken = user.idToken;
      if (!idToken) {
        console.error('Google login: idToken not found on SocialUser');
        this.zone.run(() => {
          this.error = 'אירעה שגיאה בקבלת הטוקן מגוגל';
          this.cdr.markForCheck();
        });
        return;
      }

      this.zone.run(() => {
        this.error = null;
        this.isLoading = true;
        this.cdr.markForCheck();
      });

      this.http.post<LoginResponse>('https://localhost:7260/api/Auth/google', { idToken }).subscribe({
        next: (response) => {
          this.zone.run(() => {
            this.authService.handleLoginResponse(response);

            if (this.authService.isAdmin()) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/gifts']);
            }

            this.isLoading = false;
            this.cdr.markForCheck();
          });
        },
        error: (err) => {
          console.error('Google login API error', err);
          this.zone.run(() => {
            this.error = 'אירעה שגיאה בהתחברות עם גוגל';
            this.isLoading = false;
            this.cdr.markForCheck();
          });
        },
      });
    });
  }
}
