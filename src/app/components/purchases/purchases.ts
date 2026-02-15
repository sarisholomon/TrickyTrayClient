import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { PurchaseService } from '../../services/purchase-service';
import { MessageService } from 'primeng/api';
import { UserPurchase } from '../../models/models';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth-service';
// import { Customer } from '@/domain/customer'; // הוספתי בהערה כי לא נעשה בו שימוש בקוד

@Component({
    selector: 'app-table-row-expansion-demo',
    templateUrl: './purchases.html', // הפניה לקובץ ה-HTML
    standalone: true,
    imports: [CommonModule,ButtonModule, RatingModule, TableModule, TagModule, ToastModule, RippleModule, FormsModule],
    providers: [PurchaseService, MessageService]
})
export class Purchases implements OnInit {
    private purchaseService = inject(PurchaseService);
    private messageService = inject(MessageService);
    public authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);
    purchases: UserPurchase[]=[];
    expandedRows: any = {};

    ngOnInit() {

       this.purchaseService.getAllByUser().subscribe({
        next: (data) => {
            this.purchases = data;
                console.log(this.purchases);
                this.cdr.detectChanges();

        },
        error: (err) => {
            console.error('Error fetching purchases:', err);
        }
    });
    console.log(this.purchases);
    
    }

  
    expandAll() {
    this.expandedRows = this.purchases.reduce((acc, p) => {
        acc[p.purchaseId] = true; // שינוי מ-id ל-purchaseId
        return acc;
    }, {} as { [key: string]: boolean });
}

    collapseAll() {
        this.expandedRows = {};
    }




    onRowExpand(event: TableRowExpandEvent) {
        this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({
            severity: 'success',
            summary: 'Product Collapsed',
            detail: event.data.name,
            life: 3000
        });
    }
}