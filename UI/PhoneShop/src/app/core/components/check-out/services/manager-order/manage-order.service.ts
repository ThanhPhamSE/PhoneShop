import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../models/order';
import { UserCheckout } from '../../models/user-checkout';
import { OrderItem } from '../../models/orderItem';
import { ProductManage } from '../../../product-manage/model/product-manage';
import { Address } from '../../models/address';
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

  getOrderItemById(orderId: string) {
    return this.http.get<OrderItem[]>(
      `${this.apiUrl}/get-order-items-by-orderId?orderId=${orderId}`
    );
  }

  getOrderById(orderId: string) {
    return this.http.get<Order>(
      `${this.apiUrl}/get-order-by-id?orderId=${orderId}`
    );
  }

  getProductById(productId: string) {
    return this.http.get<ProductManage>(
      `${this.apiUrl}/get-product-by-id?productId=${productId}`
    );
  }

  getAddressByUserId(userId: string) {
    return this.http.get<Address>(
      `${this.apiUrl}/get-address-by-userId?userId=${userId}`
    );
  }

  changeStatus(orderId: string, status: string) {
    return this.http.put(
      `${this.apiUrl}/change-status-order?orderId=${orderId}&status=${status}`,
      null
    );
  }
}
