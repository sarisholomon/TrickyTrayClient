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
    SelectModule
  ],
  templateUrl: './gift-catalog.html',
  styleUrls: ['./gift-catalog.scss']
})
export class GiftCatalog implements OnInit {
  public giftService = inject(GiftService);
  private CartService = inject(CartService);
  private TicketPriceService = inject(TicketPriceService);
  public authService = inject(AuthService);
  public categoryService = inject(CategoryService);
  public donorService = inject(DonorService);

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
  selectedFile: File | null = null; 

  ngOnInit() {
    this.loadGifts();
    this.TicketPriceService.getAll().subscribe((data) => {
      this.price = data;
    });

    this.categoryService.getAll().subscribe(data => this.categories.set(data));
    this.donorService.getAll().subscribe(data => this.donors.set(data));

    this.TicketPriceService.getAll().subscribe((data) => {
      this.price = data;
    });
  }

  loadGifts() {
    this.giftService.getAll().subscribe((data) => {
      this.gifts.set([...data]);
          console.log(data);

    });
    
  }
random(){
  
this.giftService.random().subscribe()
}
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveGift() {
    const formData = new FormData();
    formData.append('Name', this.currentGift.name);
    formData.append('Description', this.currentGift.description);
    formData.append('CategoryId', this.currentGift.categoryId.toString());
    formData.append('DonorId', this.currentGift.donorId.toString()); // השורה החדשה

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }


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
    this.CartService.addCartItem(id).subscribe();
  }
  showDialog(gift?: any) {
  this.visible = true;
  
  if (gift) {
    this.isEditMode = true;
    // יצירת עותק של המתנה והבטחה שה-ID של הקטגוריה והתורם מושמים נכון
    this.currentGift = { 
      ...gift,
      categoryId: gift.categoryId || (gift.category ? gift.category.id : null),
      donorId: gift.donorId || (gift.donor ? gift.donor.id : null)
    };
    console.log('Editing gift:', this.currentGift);
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
  }
}
}