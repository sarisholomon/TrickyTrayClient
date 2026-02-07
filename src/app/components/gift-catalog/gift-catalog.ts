import { Component, OnInit, inject, signal } from '@angular/core';
import { GiftService } from '../../services/gift-service';
import { CartService } from '../../services/cart-service';
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
    InputTextModule
  ],
  templateUrl: './gift-catalog.html',
  styleUrls: ['./gift-catalog.scss']
}) 
export class GiftCatalog implements OnInit {
  public giftService = inject(GiftService);
  private CartService = inject(CartService);
  private TicketPriceService = inject(TicketPriceService);
  public authService = inject(AuthService);

  gifts = signal<any>([]);
  price: number = 0;
  layout: 'list' | 'grid' = 'list';
  options: any[] = [
    { label: 'List', value: 'list', icon: 'pi pi-bars' },
    { label: 'Grid', value: 'grid', icon: 'pi pi-th-large' }
  ];
  
  visible: boolean = false;
  isEditMode: boolean = false;
  
  // אובייקט מתנה מעודכן לפי השדות בתמונה
  currentGift: any = { id: 0, name: '', description: '', categoryId: 0, imgUrl: '' }; 
  selectedFile: File | null = null; // משתנה לשמירת הקובץ הנבחר

  ngOnInit() {
    this.loadGifts();
    this.TicketPriceService.getAll().subscribe((data) => {
      this.price = data;
    });
  }

  loadGifts() {
    this.giftService.getAll().subscribe((data) => {
      this.gifts.set([...data]);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  showDialog(gift?: any) {
    if (gift) {
      this.currentGift = { ...gift };
      this.isEditMode = true;
    } else {
      this.currentGift = { id: 0, name: '', description: '', categoryId: 0, imgUrl: '' };
      this.isEditMode = false;
    }
    this.selectedFile = null; // איפוס הקובץ בכל פתיחה
    this.visible = true;
  }

  saveGift() {
    const formData = new FormData();
    // מיפוי השדות בדיוק לפי צילום המסך של ה-API
    formData.append('Name', this.currentGift.name);
    formData.append('Description', this.currentGift.description);
    formData.append('CategoryId', this.currentGift.categoryId.toString());
    
    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    if (this.isEditMode) {
      // שליחת ה-ID בנפרד עבור ה-Path Parameters וה-formData עבור ה-Body
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
    this.CartService.addCartItem(id).subscribe();
  }
}