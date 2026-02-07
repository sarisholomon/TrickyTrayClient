
import { inject, Injectable } from '@angular/core';
import { Donor } from '../models/models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DonorService {
  // שימי לב לתיקון ל-Donors (רבים) בהתאם לקונטרולר
  private apiUrl = `${environment.apiUrl}/Donors`; 
  private http: HttpClient = inject(HttpClient);

  // קבלת כולם
  getAll(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.apiUrl);
  }

  // קבלת תורם בודד לפי מזהה
  getById(id: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/${id}`);
  }

  // הוספת תורם - מחזיר את התורם שנוצר ולא מערך
  addDonor(donor: Donor): Observable<Donor> {
    return this.http.post<Donor>(this.apiUrl, donor);
  }

  // מחיקת תורם
  deleteDonor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // עדכון תורם
  updateDonor(id: number, donor: Donor): Observable<Donor> {
    return this.http.put<Donor>(`${this.apiUrl}/${id}`, donor);
  }

  // פונקציית הסינון (תואם ל-FilterDonors בשרת)
  filterDonors(name?: string, email?: string, giftName?: string): Observable<any[]> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (email) params = params.set('email', email);
    if (giftName) params = params.set('giftName', giftName);

    return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
  }
}