import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftService } from '../../services/gift-service'; // תוודא שהנתיב נכון
import { DonorService } from '../../services/donor-service'; // תוודא שהנתיב נכון
import { CartService } from '../../services/cart-service'; 
import { Gift, Donor, PurchasedGiftItem, UserPurchase } from '../../models/models';
import { PurchaseService } from '../../services/purchase-service';
import { Purchases } from '../purchases/purchases';
import { TicketPriceService } from '../../services/ticket-price-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private giftService = inject(GiftService);
  private donorService = inject(DonorService);
  private cartService = inject(CartService);
  private purchaseService = inject(PurchaseService);
    private TicketPriceService = inject(TicketPriceService);
  

  // סיגנלים לנתוני הבסיס
  gifts = signal<Gift[]>([]);
  donors = signal<Donor[]>([]);
  purchases=signal<UserPurchase[]>([]);
    price: number = 0;

  // חישובים אוטומטיים לכרטיסי הסטטיסטיקה
  totalGifts = computed(() => this.gifts().length);
  totalDonors = computed(() => this.donors().length);
  
  // דוגמה לחישוב הכנסות (בהנחה שיש לך נתון כזה בשירות או שאתה מחשב לפי מכירות)
  totalIncome = computed(() => this.purchases().length*this.price);// ניתן לחבר ל-API ייעודי
  ticketsSold = computed(() => this.purchases().length);

// מתנות מובילות - מיון לפי כמות כרטיסים (אם קיים בשדות ה-Gift)
  topGifts = computed(() => {
    return [...this.gifts()]
      .sort((a, b) => (b.users.length || 0) - (a.users.length || 0))
      .slice(0, 3);
  });

  ngOnInit() {
    // טעינת הנתונים מהשרת
    this.giftService.getAll().subscribe(data => this.gifts.set(data));
    this.donorService.getAll().subscribe(data => this.donors.set(data));
    this.purchaseService.getAll().subscribe(data => this.purchases.set(data));
      this.TicketPriceService.getAll().subscribe((data) => {
      this.price = data;
    });
  }

  goToRaffle() {
    console.log("מעבר למסך הגרלה...");
    // כאן תוכל להוסיף ניווט: this.router.navigate(['/raffle']);
  }
}
