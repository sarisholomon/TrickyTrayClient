import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CartItem } from '../models/models';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth-service'; // <--- שימי לב לייבוא הזה

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {
  // אנחנו מזריקים את AuthService ומאזינים לשינויים
  this.authService.currentUser$.subscribe(user => {
    if (!user) {
      // ברגע שהמשתמש מתנתק, אנחנו מאפסים את הסיגנל
      this.cartItems.set([]); 
      console.log('הסל אופס בהצלחה בעקבות התנתקות');
    }
    else{
      this.getAll().subscribe();
    }
    
  });
}
  private apiUrl = `${environment.apiUrl}/CartItems`;
  authService = inject(AuthService);
  http: HttpClient = inject(HttpClient);
  cartItems = signal<CartItem[]>([]);

  // חישוב אוטומטי של הכמות
totalQuantity = computed(() => {
  return this.cartItems().reduce((acc: number, item: CartItem) => {
    return acc + item.quantity;
  }, 0);
});

  // פונקציה לעדכון הנתונים (תקראי לה מה-Cart Component)
  updateCart(items: CartItem[]) {
    this.cartItems.set(items);
  }
  addCartItem(id: number): Observable<CartItem> {
    const userId  = this.authService.getUserId();
return this.http.post<CartItem>(this.apiUrl, { userId: userId, giftId: id, quantity: 1 }).pipe(
    tap(() => {
      // אחרי הוספה מוצלחת, נקרא שוב ל-getAll כדי לעדכן את ה-Signal לכולם
      this.getAll().subscribe(); 
    })
  );  }
  getAll(): Observable<CartItem[]> {
    const userId  = this.authService.getUserId();
    return this.http.get<CartItem[]>(this.apiUrl + "/user/" + userId).pipe(
    tap(items => {
      this.cartItems.set(items); // כאן אנחנו מעדכנים את ה-Signal!
    })
  );
  }
removeCartItem(id: number): Observable<any> {
  console.log(id+"dfghj");
  
  return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    tap(() => {
      // עדכון ה-Signal ישירות בצד הלקוח
      // נניח ש-cartItems הוא ה-Signal שלך
      this.cartItems.update(items => items.filter(item => item.id !== id));
    })
  );
}
checkOut():Observable<any>{
    const userId  = this.authService.getUserId();
    return this.http.post(`https://localhost:7260/api/Purchase/checkout/${userId}`,{}).pipe(
        tap(() => {
      // עדכון ה-Signal ישירות בצד הלקוח
      // נניח ש-cartItems הוא ה-Signal שלךs
      this.cartItems.set([]);
    })
    )
}
  clearCart() {
  this.cartItems.set([]); // מאפס את הסל לריק
}
}
