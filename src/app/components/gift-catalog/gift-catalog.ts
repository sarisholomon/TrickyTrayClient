import { Component, OnInit, inject, signal } from '@angular/core';
import { GiftService } from '../../services/gift-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton'; 
import { DataViewModule } from 'primeng/dataview'; 
import { TicketPriceService } from '../../services/ticket-price-service';
@Component({
  selector: 'app-gift-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,        
    ButtonModule,
    TagModule,
    SelectButtonModule,
    DataViewModule 
  ],
  templateUrl: './gift-catalog.html',
  styleUrls: ['./gift-catalog.scss']
}) 
export class GiftCatalog implements OnInit {
   private GiftService = inject(GiftService);
      private TicketPriceService = inject(TicketPriceService);

   gifts = signal<any>([]);
   price:number=0;
layout: 'list' | 'grid' = 'list';
   options: any[] = [
       { label: 'List', value: 'list', icon: 'pi pi-bars' },
       { label: 'Grid', value: 'grid', icon: 'pi pi-th-large' }
   ];

   ngOnInit() {
    this.GiftService.getAll().subscribe((data) => {
        this.gifts.set([...data.slice(0, 12)]);
    });
    this.TicketPriceService.getAll().subscribe((data) => {
        this.price=data;
    });
  }
 
}