import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.get('token'); // שליפת הטוקן מהקוקי

  // אם יש טוקן, משכפלים את הבקשה ומוסיפים לה את הכותרת
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // אם אין טוקן, מעבירים את הבקשה כמו שהיא
  return next(req);
};