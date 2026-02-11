import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { GiftCatalog } from './components/gift-catalog/gift-catalog';
import { Cart } from './components/cart/cart';
import { Purchases } from './components/purchases/purchases';
import { Donors } from './components/donors/donors';
import { Dashboard } from './components/dashboard/dashboard';

// 1. הגדרת מערך הנתיבים של האפליקציה
export const routes: Routes = [
  // 2. נתיב ברירת המחדל - מה רואים כשנכנסים לדף הבית
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gifts', component: GiftCatalog },
  { path: 'cart', component: Cart },
  { path: 'purchases', component: Purchases },
  { path: 'donors', component: Donors },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: 'login' }


];