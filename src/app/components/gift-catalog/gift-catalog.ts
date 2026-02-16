import { Component, OnInit, inject, signal } from '@angular/core';
import { GiftService } from '../../services/gift-service';
import { CartService } from '../../services/cart-service';
import { Category, Gift } from '../../models/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DataViewModule } from 'primeng/dataview';
import { TicketPriceService } from '../../services/ticket-price-service';
import { AuthService } from '../../services/auth-service';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CategoryService } from '../../services/category-service';
import { DonorService } from '../../services/donor-service';
import { SelectModule } from 'primeng/select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gift-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TagModule,
    SelectButtonModule,
    DataViewModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './gift-catalog.html',
  styleUrls: ['./gift-catalog.scss']
})
export class GiftCatalog implements OnInit {
  // הזרקת שירותים (Services)
  public giftService = inject(GiftService);
  private CartService = inject(CartService);
  private TicketPriceService = inject(TicketPriceService);
  public authService = inject(AuthService);
  public categoryService = inject(CategoryService);
  public donorService = inject(DonorService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  // משתני State
  gifts = signal<Gift[]>([]);
  categories = signal<Category[]>([]);
  donors = signal<any[]>([]);
  price: number = 0;
  layout: 'list' | 'grid' = 'list';
  options: any[] = [
    { label: 'List', value: 'list', icon: 'pi pi-bars' },
    { label: 'Grid', value: 'grid', icon: 'pi pi-th-large' }
  ];

  visible: boolean = false;
  isEditMode: boolean = false;

  currentGift: any = { id: 0, name: '', description: '', categoryId: 0, donorId: 0, imgUrl: '' };

  // משתני העלאת תמונה
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null; // משתנה חדש שאחראי על התצוגה המקדימה!

  ngOnInit() {
    this.loadGifts();

    // שליפת נתוני הבסיס
    this.categoryService.getAll().subscribe(data => this.categories.set(data));
    this.donorService.getAll().subscribe(data => this.donors.set(data));
    this.TicketPriceService.getAll().subscribe((data) => {
      this.price = data;
    });
  }

  loadGifts() {
    this.giftService.getAll().subscribe((data) => {
      this.gifts.set([...data]);
    });
  }

 // הוסיפי משתנה חדש למחלקה
isRaffling = signal<boolean>(false);

random() {
  this.isRaffling.set(true); // הפעלת אנימציית טעינה בכפתור
  
  // הצגת הודעה שההגרלה מתחילה
  this.messageService.add({
    severity: 'info',
    summary: 'מבצע הגרלה',
    detail: 'המערכת בוחרת זוכים, נא להמתין...',
    life: 2000
  });

  this.giftService.random().subscribe({
    next: () => {
      // רענון הנתונים אוטומטית מהשרת לאחר הצלחה
      this.loadGifts(); 
      this.isRaffling.set(false);
      
      // הודעת הצלחה
      this.messageService.add({
        severity: 'success',
        summary: 'ההגרלה הסתיימה',
        detail: 'הזוכים עודכנו בהצלחה!',
        life: 3000
      });
    },
    error: (err) => {
      this.isRaffling.set(false);
      this.messageService.add({
        severity: 'error',
        summary: 'שגיאה',
        detail: 'אירעה תקלה בביצוע ההגרלה',
        life: 3000
      });
      console.error('Raffle failed:', err);
    }
  });
}

  // הפונקציה המעודכנת שטוענת את התמונה לתצוגה מקדימה לפני השמירה בשרת
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // יצירת תצוגה מקדימה באמצעות FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.previewUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // פונקציה חדשה למחיקת התמונה שנבחרה (הכפתור x מעל התמונה ב-HTML)
  clearImage() {
    this.previewUrl = null;
    this.selectedFile = null;
  }

  saveGift() {
    const formData = new FormData();
    formData.append('Name', this.currentGift.name);
    formData.append('Description', this.currentGift.description);
    formData.append('CategoryId', this.currentGift.categoryId.toString());
    formData.append('DonorId', this.currentGift.donorId.toString());

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    if (this.isEditMode) {
      this.giftService.updateGift(this.currentGift.id, formData).subscribe({
        next: () => {
          this.visible = false;
          this.loadGifts();
        }
      });
    } else {
      this.giftService.addGift(formData).subscribe({
        next: () => {
          this.visible = false;
          this.loadGifts();
        }
      });
    }
  }

  deleteGift(id: number) {
    this.giftService.deleteGift(id).subscribe({
      next: () => this.loadGifts()
    });
  }

  addToCart(id: number) {
    if (!this.authService.isLoggedIn()) {
      // במקום alert('נא להתחבר') - שלחי הודעה מעוצבת:
      this.messageService.add({
        severity: 'info',
        summary: 'התחברות נדרשת',
        detail: 'כדי להוסיף מתנות לסל, עליך להתחבר למערכת',
        life: 3000
      });

      setTimeout(() => this.router.navigate(['/login']), 1500);
      return;
    }
    this.CartService.addCartItem(id).subscribe();
  }

  showDialog(gift?: any) {
    this.visible = true;

    if (gift) {
      this.isEditMode = true;
      this.currentGift = {
        ...gift,
        categoryId: gift.categoryId ? Number(gift.categoryId) : (gift.category?.id ? Number(gift.category.id) : null),
        donorId: gift.donorId ? Number(gift.donorId) : (gift.donor?.id ? Number(gift.donor.id) : null)
      };

      this.previewUrl = gift.imgUrl ? 'https://localhost:7260' + gift.imgUrl : null;
      this.selectedFile = null;

    } else {
      this.isEditMode = false;
      this.currentGift = {
        id: 0,
        name: '',
        description: '',
        categoryId: null,
        donorId: null,
        imgUrl: ''
      };

      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'אין אפשרות להוסיף מתנה לסל ללא התחברות',
      message: 'רוצה להתחבר עכשיו?',
      accept: () => {
        this.router.navigate(['/login']);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'הפריט לא נוסף לסל ',
          life: 3000
        });
      }
    });
  }
}