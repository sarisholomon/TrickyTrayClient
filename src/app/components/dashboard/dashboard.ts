import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GiftService } from '../../services/gift-service'; // תוודא שהנתיב נכון
import { DonorService } from '../../services/donor-service'; // תוודא שהנתיב נכון
import { CartService } from '../../services/cart-service'; 
import { Gift, Donor, PurchasedGiftItem, UserPurchase } from '../../models/models';
import { PurchaseService } from '../../services/purchase-service';
import { TicketPriceService } from '../../services/ticket-price-service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,ButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'], 
})
export class Dashboard implements OnInit {
  private giftService = inject(GiftService);
  private donorService = inject(DonorService);
  private cartService = inject(CartService);
  private purchaseService = inject(PurchaseService);
  private TicketPriceService = inject(TicketPriceService);
  router = inject(Router);
  goToDonors() {
    this.router.navigate(['/donors']);
  }
 goToGifts() {
    this.router.navigate(['/gifts']);
  } goToPurchase() {
    this.router.navigate(['/purchases']);
  }
  handleCardClick(label: string) {
    switch (label) {
      case 'תורמים':
        this.goToDonors();
        break;
      case 'מתנות':
        this.goToGifts();
        break;
      case 'הכנסות':
      case 'כרטיסים נמכרו':
        this.goToPurchase();
        break;
    }
  }
  gifts = signal<Gift[]>([]);
  donors = signal<Donor[]>([]);
  purchases=signal<UserPurchase[]>([]);
    price: number = 0;

  totalGifts = computed(() => this.gifts().length);
  totalDonors = computed(() => this.donors().length);
  
  totalIncome = computed(() => this.purchases().length*this.price);
  ticketsSold = computed(() => this.purchases().length);

  topGifts = computed(() => {
    return [...this.gifts()]
      .sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold|| 0))
      .slice(0, 3);
  });

  ngOnInit() {
    this.giftService.getAll().subscribe(data => this.gifts.set(data));
    this.donorService.getAll().subscribe(data => this.donors.set(data));
    this.purchaseService.getAll().subscribe(data => this.purchases.set(data));
      this.TicketPriceService.getAll().subscribe((data) => {
      this.price = data;
    });
    
  }

  goToRaffle() {
   
this.router.navigate(['/gifts'])
  }
}
