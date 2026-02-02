import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { TicketPrice } from '../models/models';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TicketPriceService {
  private apiUrl = `${environment.apiUrl}/ticket-price`; 
  http: HttpClient = inject(HttpClient);
  private price$: Observable<number> | null = null;

  getAll(): Observable<number> {
    // אם כבר ביצענו את הקריאה, נחזיר את המשתנה הקיים
    if (!this.price$) {
      this.price$ = this.http.get<TicketPrice>(this.apiUrl).pipe(
        map(response => response.price),
        shareReplay(1) // שומר את התוצאה האחרונה עבור הנרשמים הבאים
      );
    }
    return this.price$;
  }
}
