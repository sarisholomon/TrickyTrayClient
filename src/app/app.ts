import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./components/login/login";
import { RegisterComponent } from "./components/register/register";
import {GiftCatalog  } from "./components/gift-catalog/gift-catalog";
import { Menu } from './components/menu/menu';
import { CartService } from './services/cart-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, RegisterComponent, GiftCatalog, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
  cartService = inject(CartService);

  ngOnInit() {
    // בלי השורה הזו, ה-Signal בשירות יישאר ריק (0) עד שתיכנסי לדף העגלה
    this.cartService.getAll().subscribe();
  }
}
