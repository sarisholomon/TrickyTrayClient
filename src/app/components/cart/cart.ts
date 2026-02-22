import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CartService } from '../../services/cart-service';
import { CartItem } from '../../models/models';
import { DividerModule} from 'primeng/divider';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Card } from 'primeng/card';      
import { DataViewModule } from 'primeng/dataview';
import { TicketPriceService } from '../../services/ticket-price-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PaymentComponent } from "../payment-component/payment-component";
@Component({
  selector: 'app-cart',   
  standalone: true,
  imports: [ButtonModule, RatingModule, TableModule, TagModule, FormsModule, DividerModule, CurrencyPipe, Card, DataViewModule, CommonModule, ConfirmDialogModule, ToastModule, PaymentComponent],
    providers: [ConfirmationService, MessageService]
    ,  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private ticketService = inject(TicketPriceService);
   private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);
  cartItems = signal<CartItem[]>([]);
  currentPrice = signal<number>(0);
  
  totalQuantity = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  totalAmount = computed(() => {
    return this.totalQuantity() * this.currentPrice();
  });

  paymentFinished = false;
removeItem(id:number){  
  console.log(id);
  this.cartService.removeCartItem(id).subscribe();
        this.cartItems.update(items => items.filter(item => item.id !== id));

}

  ngOnInit() {
    this.cartService.getAll().subscribe((data) => {
      this.cartItems.set(data);
    });

    this.ticketService.getAll().subscribe((price) => {
      this.currentPrice.set(price);
    });
  }
  confirm() {
        this.paymentFinished = false;
        this.confirmationService?.confirm({
            header: 'האם אתה בטוח?',
        message: 'לאחר האישור, הכרטיסים יכנסו למערכת ולא ניתן יהיה לבטל את הפעולה. להמשיך לתשלום?',
            reject: () => {
          if (!this.paymentFinished) {
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Rejected', 
              detail: 'הפעולה בוטלה', 
              life: 3000 
            });
          }
            }
        });
    }

    onPurchaseCompleted() {
      this.cartItems.set([]);
      this.paymentFinished = true;
    }
}
