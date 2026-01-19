import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { User, TypeCostumer } from '../models/models';

// הגדרת המבנה שהשרת מחזיר ב-LoginResponseDTO
export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // כתובת ה-API שמפנה ל-AuthController בשרת שלך
  private apiUrl = `${environment.apiUrl}/Auth`; 

  // ניהול המשתמש המחובר בזיכרון ה-RAM של האפליקציה
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    // שחזור משתמש מהקוקיז במידה והדף רוענן (F5)
    const savedUser = this.cookieService.get('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // --- פונקציית REGISTER (הרשמה) ---
  register(userData: any): Observable<any> {
    // 1. מבצע קריאת POST לנתיב הספציפי שהגדרת ב-C#
    // 2. userData מכיל את השדות: FirstName, LastName, Email, Password, PhoneNumber
    // 3. השרת מקבל את זה כאובייקט UserCreateDTO
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // --- פונקציית LOGIN (התחברות) ---
  login(email: string, password: string): Observable<LoginResponse> {
    // שליחת אימייל וסיסמה לשרת לקבלת טוקן
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      // שימוש ב-tap לשמירת הנתונים בקוקיז אם הלוגין הצליח
      tap(response => this.setSession(response))
    );
  }

  // פונקציית עזר פנימית לשמירת המידע לאחר הצלחה
  private setSession(response: LoginResponse): void {
    // שמירת ה-Token (לצורך אימות עתידי מול השרת)
    this.cookieService.set('token', response.token, 1, '/');
    // שמירת אובייקט המשתמש (לצורך הצגת שם ותפקיד באתר)
    this.cookieService.set('currentUser', JSON.stringify(response.user), 1, '/');
    // הזרמת המשתמש לכל חלקי האפליקציה שמאזינים ל-currentUser$
    this.currentUserSubject.next(response.user);
  }

  // בדיקה האם המשתמש הוא אדמין
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.typeCostumer === TypeCostumer.Admin;
  }

  // התנתקות - מחיקת כל המידע מהדפדפן
  logout(): void {
    this.cookieService.delete('token', '/');
    this.cookieService.delete('currentUser', '/');
    this.currentUserSubject.next(null);
  }
}