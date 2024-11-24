import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserCheckout } from '../../models/user-checkout';
import { ProductManage } from '../../../product-manage/model/product-manage';
import { Address } from '../../models/address';
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
}
