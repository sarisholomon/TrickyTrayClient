import { Component, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { toSignal } from '@angular/core/rxjs-interop'; // <--- 1. ייבוא חשוב
import { TypeCostumer, User } from '../../models/models'
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [AvatarModule, BadgeModule, MenuModule, RippleModule, CommonModule, RouterModule],
    templateUrl: './menu.html',
    styleUrl: './menu.scss',
})
export class Menu {
    private authService = inject(AuthService);
    private cartService = inject(CartService);

    // <--- 2. המרת ה-Observable ל-Signal כדי שנוכל להשתמש בו בתוך computed
userSignal = toSignal<User | null>(this.authService.currentUser$);
    // הופכים את items לסיגנל מחושב שמגיב לשינויים אוטומטית
   items = computed<MenuItem[]>(() => {
    // 1. קריאה לסיגנלים בתחילת הפונקציה כדי להירשם לשינויים
    const user = this.userSignal();
    const cartCount = this.cartService.totalQuantity();
    
    // const isAdmin = user?.type == TypeCostumer.Admin;
    console.log(this.authService.isAdmin());
    

    return [
        { separator: true },
        {
            label: 'Menu',
            items: [
                {
                    label: 'מתנות',
                    icon: 'pi pi-gift',
                    routerLink: ['/gifts']
                },
                  {
                    label: 'תורמים',
                    icon: 'pi pi-users',
                    routerLink: ['/donors'],
                    visible: this.authService.isAdmin() 
                },
                {
                    label: 'סל קניות',
                    icon: 'pi pi-shopping-bag',
                    badge: cartCount.toString(),
                    routerLink: ['/cart'],
                    // כאן אנחנו מוודאים שהתנאי מחושב מחדש
                    visible: user !== null && !this.authService.isAdmin() 
                },
                {
                    label: 'רכישות',
                    icon: 'pi pi-shopping-cart',
                    routerLink: ['/purchases'],
                    visible: user !== null
                },
                   
                {
                    label:user !== null? 'Logout':"Login",
                    icon:user !== null? 'pi pi-sign-out':'pi pi-sign-in' ,
                    command: () => this.logout()
                }
            ]
        }
    ];
});

    logout() {
        this.authService.logout();
    }
}