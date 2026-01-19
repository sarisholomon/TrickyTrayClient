import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer'; // ייבוא המודול
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [AvatarModule, BadgeModule, MenuModule, RippleModule],         
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                separator: true
            },
            {
                label: 'Documents',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-plus',
                        shortcut: '⌘+N'
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-search',
                        shortcut: '⌘+S'
                    }
                ]
            },
            {
                label: 'Profile',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        shortcut: '⌘+O'
                    },
                    {
                        label: 'Messages',
                        icon: 'pi pi-inbox',
                        badge: '2'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        shortcut: '⌘+Q',
                        linkClass: '!text-red-500 dark:!text-red-400'
                    }
                ]
            },
            {
                separator: true
            }
        ];
    }

}
