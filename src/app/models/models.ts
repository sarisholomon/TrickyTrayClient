/**
 * Models for Tricky Tray System
 * File: src/app/core/models/models.ts
 */

// --- Enums ---

export enum TypeCostumer {
    Admin = 'Admin',
    User = 'User' // או Customer, לפי מה שמופיע ב-Console
}

// --- Core Entities ---

export interface User {
    id: number;
    lastName: string;
    firstName: string;
    email: string | null;
    passwordHash: string;
    phoneNumber: string;
    type: TypeCostumer;
    googleId?: string | null;
    lastLoginAt?: Date | string | null;
    cartItems?: CartItem[];
}

export interface Donor {
    id: number;
    name: string | null;
    email: string | null;
    phoneNumber?: string;
    gifts?: Gift[];
    giftsString?:string | "";
}

export interface Category {
    id: number;
    name: string | null;
}

export interface Gift {
    id: number;
    name: string | null;
    imgUrl: string;
    description: string | null;
        winnerEmail: string | null;

    donorId: number;
    donor?: Donor | null;
    categoryId: number;
    category?: Category | null;
    winnerId?: number | null;
    winner?: User | null;
    ticketsSold: number;
    canDelete?: boolean; // שדה עזר להצגת כפתור מחיקה בממשק הניהול
}

// --- Cart & Purchase Entities ---

export interface CartItem {
    id: number;
    quantity: number;
    giftId: number;
    gift?: Gift;
    userId: number;
    user?: User;
}

// export interface Purchase {
//     id: number;
//     userId: number;
//     user?: User;
//     purchaseItems: PurchaseItem[];
//     price: number;
//     date: Date | string;
// }
// מודל עבור הפריט הבודד (המתנה בתוך הקניה)
export interface PurchasedGiftItem {
    giftId: number;
    giftName: string;
    imgUrl: string;
    quantity: number;
}

// מודל עבור הקניה כולה
export interface UserPurchase {
    purchaseId: number;
    date: Date;        // בדרך כלל מגיע כ-string מהשרת, אך נגדיר כ-Date לשימוש נוח
    totalPrice: number;
    totalTickets: number;
    items: PurchasedGiftItem[]; // מערך של הפריטים למעלה
}
// export interface PurchaseItem {
//     id: number;
//     giftId: number;
//     gift?: Gift;
//     isWinner: boolean;
//     userId: number;
//     user?: User;
// }

export interface TicketPrice {
    id: number;
    price: number;
}