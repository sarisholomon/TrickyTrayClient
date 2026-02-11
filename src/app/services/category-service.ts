import { inject, Injectable } from '@angular/core';
import { Gift } from '../models/models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/Categories`; 
http: HttpClient = inject(HttpClient);

  getAll(): Observable<Gift[]>{
return this.http.get<Gift[]>(this.apiUrl);
} 
}
