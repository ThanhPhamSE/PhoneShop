import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserCheckout } from '../../models/user-checkout';
import { ProductManage } from '../../../product-manage/model/product-manage';
import { Address } from '../../models/address';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/orderItem';
@Injectable({
  providedIn: 'root',
})
export class ConfirmOrderService {
  private apiUrl = 'https://localhost:7026/api/ConfirmOrder';
  constructor() {}
  http = inject(HttpClient);

  getAddressByEmail(email: string) {
    return this.http.get<Address>(
      `${this.apiUrl}/get-address-by-email?email=${email}`
    );
  }

  getUserByEmail(email: string) {
    return this.http.get<UserCheckout>(
      `${this.apiUrl}/get-user-by-email?email=${email}`
    );
  }

  addAddress(data: Address) {
    return this.http.post(`${this.apiUrl}/add-address`, data);
  }

  updateAddress(data: Address) {
    return this.http.put(`${this.apiUrl}/update-address`, data);
  }

  addOrder(data: Order) {
    return this.http.post(`${this.apiUrl}/add-order`, data);
  }

  addOrderItem(data: OrderItem) {
    return this.http.post(`${this.apiUrl}/add-order-item`, data);
  }

  updateProductQuantity(data: ProductManage) {
    return this.http.put(
      `${this.apiUrl}/update-quantity-after-place-order`,
      data
    );
  }
}
