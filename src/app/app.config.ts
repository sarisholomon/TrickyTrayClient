import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { CookieService } from 'ngx-cookie-service';  
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // הוספה עבור אנימציות
import { providePrimeNG } from 'primeng/config'; // הוספה עבור הגדרות PrimeNG
import Aura from '@primeng/themes/aura'; // ייבוא ערכת הנושא Aura

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
provideRouter(routes), // מחבר את המערך שהגדרנו למעלה לאפליקציה    provideHttpClient(), 
    CookieService,
    // --- הגדרות חדשות עבור PrimeNG 18 ---
    provideAnimationsAsync(), // מאפשר אנימציות חלקות ברכיבים (כמו פתיחת דרופ-דאון)
    providePrimeNG({ 
        theme: {
            preset: Aura, // קובע שכל הרכיבים ישתמשו בעיצוב Aura המודרני
            options: {
                darkModeSelector: false // מבטל מעבר אוטומטי למצב לילה אם אתן לא רוצות
            }
        }
    })
  ]
};