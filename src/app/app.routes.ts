import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
// 1. הגדרת מערך הנתיבים של האפליקציה
export const routes: Routes = [
  // 2. נתיב ברירת המחדל - מה רואים כשנכנסים לדף הבית
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 3. הגדרת הנתיב לדף ההתחברות
  { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },


  // 4. נתיב "תפיסת כל השאר" - אם המשתמש הקליד כתובת שלא קיימת
  { path: '**', redirectTo: 'login' }
];