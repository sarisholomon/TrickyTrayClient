import { Component, computed, inject, Injector } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer'; // ייבוא המודול
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart-service';
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

    user$ = this.authService.currentUser$;

    // הופכים את items לסיגנל מחושב שמגיב לשינויים אוטומטית
    items = computed<MenuItem[]>(() => [
        { separator: true },
        {
            label: 'Menu',
            items: [
                {
                    label: 'מתנות',
                    icon: 'pi pi-cog',
                    routerLink: ['/gifts']
                },
                {
                    label: 'סל קניות',
                    icon: 'pi pi-inbox',
                    // כאן הקסם: בכל פעם ש-totalQuantity ישתנה בשירות, כל המערך יתעדכן
                    badge: this.cartService.totalQuantity().toString(),
                    routerLink: ['/cart']
                },
                 {
                    label: 'כרטיסים שנרכשו',
                    icon: 'pi pi-inbox',
                    routerLink: ['/']
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    linkClass: '!text-red-500 dark:!text-red-400',
                    command: () => this.logout()
                }
            ]
        },
        { separator: true }
    ]);

    logout() {
        this.authService.logout();
    }
}