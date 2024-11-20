import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../models/order';
import { UserCheckout } from '../../models/user-checkout';
@Injectable({
  providedIn: 'root',
})
export class ManageOrderService {
  private apiUrl = 'https://localhost:7026/api/Order';
  constructor() {}
  http = inject(HttpClient);

  getAllOrders() {
    return this.http.get<Order[]>(`${this.apiUrl}/get-all-order`);
  }
  getOrderByStatus(status: string) {
    return this.http.get<Order[]>(
      `${this.apiUrl}/get-order-by-status?status=${status}`
    );
  }
  getUserById(userId: string) {
    return this.http.get<UserCheckout>(
      `${this.apiUrl}/get-user-by-id?userId=${userId}`
    );
  }

  getOrderByEmail(userEmail: string) {
    return this.http.get<Order[]>(
      `${this.apiUrl}/get-order-by-email?userEmail=${userEmail}`
    );
  }
}
