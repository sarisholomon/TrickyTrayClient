import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserPurchase } from '../models/models';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = `${environment.apiUrl}/Purchase`; 
http: HttpClient = inject(HttpClient);
private authService=inject(AuthService)
    getAllByUser(): Observable<UserPurchase[]>{
          const userId  = this.authService.getUserId();

  return this.http.get<UserPurchase[]>(this.apiUrl+"/ByUser/"+userId);
  }
}
