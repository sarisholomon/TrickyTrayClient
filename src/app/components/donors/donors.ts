import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core'; // הוסיפי ChangeDetectorRef
import { DonorService } from '../../services/donor-service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Donor } from '../../models/models';

@Component({
    selector: 'app-donors',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ButtonModule, ConfirmDialogModule, 
        DialogModule, IconFieldModule, InputIconModule, 
        TableModule, ToastModule, ToolbarModule, InputTextModule
    ],
    providers: [DonorService, MessageService, ConfirmationService],
    templateUrl: './donors.html'
})
export class Donors implements OnInit {
    // הזרקת התלויות החדשה (Angular 14+)
    private donorService = inject(DonorService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef); // הזרקה של המזהה


    donors: Donor[] = [];
    donor: Donor = this.createEmptyDonor();
    selectedDonors!: Donor[] | null;
    submitted: boolean = false;
    donorDialog: boolean = false;
@ViewChild('dt') table!: Table;
    ngOnInit() {
        this.loadDonors();
        
    }
    exportCSV(event: any) {
        this.table.exportCSV();
    }

    // פונקציית עזר ליצירת תורם ריק
    createEmptyDonor(): Donor {
        return { 
            id: 0, 
            name: '', 
            email: '', 
            phoneNumber: '', 
            gifts: [], 
            giftsString: '' 
        };
    }

    loadDonors() {
        this.donorService.getAll().subscribe((data) => {
            this.donors = data;
            this.cdr.detectChanges(); // הכרחת עדכון ה-UI
            console.log(data);
            
        });
    }

    openNew() {
        this.donor = this.createEmptyDonor();
        this.submitted = false;
        this.donorDialog = true;
    }

    editDonor(donor: Donor) {
        this.donor = { ...donor };
        this.donorDialog = true;
    }

    saveDonor() {
        this.submitted = true;

        if (this.donor.name?.trim()) {
            if (this.donor.id !== 0) {
                // עדכון תורם קיים
                this.donorService.updateDonor(this.donor.id, this.donor).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'הפרטים עודכנו בהצלחה', life: 3000 });
                    this.loadDonors(); // רענון הטבלה
                });
            } else {
                // יצירת תורם חדש
                this.donorService.addDonor(this.donor).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'תורם חדש נוצר', life: 3000 });
                    this.loadDonors(); // רענון הטבלה
                });
            }

            this.donorDialog = false;
            this.donor = this.createEmptyDonor();
        }
    }

    deleteDonor(donor: Donor) {
        this.confirmationService.confirm({
            message: `האם את בטוחה שברצונך למחוק את ${donor.name}?`,
            header: 'אישור מחיקה',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'כן',
            rejectLabel: 'לא',
            accept: () => {
                this.donorService.deleteDonor(donor.id).subscribe(() => {
                    this.messageService.add({ severity: 'success', summary: 'הצלחה', detail: 'התורם נמחק', life: 3000 });
                    this.loadDonors();
                });
            }
        });
    }

    hideDialog() {
        this.donorDialog = false;
        this.submitted = false;
    }
}