import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../models/models';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth-service'; // <--- שימי לב לייבוא הזה
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/CartItems`;
  authService = inject(AuthService);
  http: HttpClient = inject(HttpClient);
  addCartItem(id: number): Observable<CartItem> {
     const userId  = this.authService.getUserId();
    return this.http.post<CartItem>(this.apiUrl, { giftId: id, userId: userId, quantity: 1 });
  }
}
