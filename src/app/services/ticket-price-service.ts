import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TicketPrice } from '../models/models';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TicketPriceService {
  private apiUrl = `${environment.apiUrl}/ticket-price`; 
  http: HttpClient = inject(HttpClient);
  
    getAll(): Observable<number>{
  return this.http.get<TicketPrice>(this.apiUrl).pipe(
    map(response=>response.price)
  );
  }
}
