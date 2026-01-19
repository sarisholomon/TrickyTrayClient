import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gift } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GiftService { 
private apiUrl = `${environment.apiUrl}/Gift`; 
http: HttpClient = inject(HttpClient);

  getAll(): Observable<Gift[]>{
return this.http.get<Gift[]>(this.apiUrl);
}
}
