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

  getById(id: number): Observable<Gift> {
      return this.http.get<Gift>(`${this.apiUrl}/${id}`);
    }
  
  
  
    deleteGift(id: number): Observable<void> {
      console.log("sdfgh");
      console.log(id);
      
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
// עדכון פונקציית ההוספה
addGift(formData: FormData): Observable<Gift> {
  return this.http.post<Gift>(this.apiUrl, formData);
}

// עדכון פונקציית העדכון
updateGift(id: number, formData: FormData) {
  // שימי לב: id עובר ב-URL, ה-formData עובר ב-Body
  return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
}
}
