import { Component, Input, computed, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { toSignal } from '@angular/core/rxjs-interop'; 
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

    @Input() layout: 'desktop' | 'mobile' = 'desktop';

    isMobileMenuOpen = false;

    userSignal = toSignal<User | null>(this.authService.currentUser$);
    items = computed<MenuItem[]>(() => {
        const user = this.userSignal();
        const cartCount = user !== null ? this.cartService.totalQuantity() : 0;
        console.log(this.authService.isAdmin());
        return [
            { separator: true },
            {
                label: 'Menu',
                items: [
                    {
                        label: 'לוח בקרה',
                        icon: 'pi pi-th-large',
                        routerLink: ['/dashboard'],
                        visible: user !== null && this.authService.isAdmin()

                    },
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
                        visible: user !== null && !this.authService.isAdmin()
                    },
                    {
                        label: 'רכישות',
                        icon: 'pi pi-shopping-cart',
                        routerLink: ['/purchases'],
                        visible: user !== null
                    },

                    {
                        label: user !== null ? 'Logout' : "Login",
                        icon: user !== null ? 'pi pi-sign-out' : 'pi pi-sign-in',
                        command: () => this.logout()
                    }
                ]
            }
        ];
    });

    logout() {
        this.authService.logout();
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
    }
}