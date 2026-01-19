import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <--- הוספתי כאן את withInterceptors
import { CookieService } from 'ngx-cookie-service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor'; // <--- הוספתי את הייבוא של הקובץ שיצרנו

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // השינוי החשוב: הוספת המיירט (Interceptor) ללקוח ה-HTTP
    provideHttpClient(withInterceptors([authInterceptor])), 
    
    CookieService,
    
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