/**
 * Models for Tricky Tray System
 * File: src/app/core/models/models.ts
 */

// --- Enums ---

export enum TypeCostumer {
    User = 0,
    Admin = 1
}

// --- Core Entities ---

export interface User {
    id: number;
    lastName: string;
    firstName: string;
    email: string | null;
    passwordHash: string;
    phoneNumber: string;
    typeCostumer: TypeCostumer;
    cartItems?: CartItem[];
}

export interface Donor {
    id: number;
    name: string | null;
    email: string | null;
    phoneNumber: string;
    gifts: Gift[];
}

export interface Category {
    id: number;
    name: string;
}

export interface Gift {
    id: number;
    name: string | null;
    imgUrl: string;
    description: string | null;
    donorId: number;
    donor?: Donor | null;
    categoryId: number;
    category?: Category | null;
    winnerId?: number | null;
    winner?: User | null;
    users: User[];
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

export interface Purchase {
    id: number;
    userId: number;
    user?: User;
    purchaseItems: PurchaseItem[];
    price: number;
    date: Date | string;
}

export interface PurchaseItem {
    id: number;
    giftId: number;
    gift?: Gift;
    isWinner: boolean;
    userId: number;
    user?: User;
}

export interface TicketPrice {
    id: number;
    price: number;
}