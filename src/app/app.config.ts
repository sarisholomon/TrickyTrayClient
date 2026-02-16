import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <--- הוספתי כאן את withInterceptors
import { CookieService } from 'ngx-cookie-service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { environment } from '../environments/environment.local';
import Aura from '@primeng/themes/aura';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SOCIAL_AUTH_CONFIG,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor'; // <--- הוספתי את הייבוא של הקובץ שיצרנו

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // השינוי החשוב: הוספת המיירט (Interceptor) ללקוח ה-HTTP
    provideHttpClient(withInterceptors([authInterceptor])), 
    
    CookieService,
    importProvidersFrom(SocialLoginModule),
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.secretPassword
            ),
          },
        ],
        onError: (err: unknown) => {
          console.error('Google social login error', err);
        },
      } as SocialAuthServiceConfig,
    },
    
    // --- הגדרות PrimeNG (נשארו בדיוק כמו שהיו) ---
    provideAnimationsAsync(),
    providePrimeNG({ 
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: false
            }
        }
    })
  ]
};