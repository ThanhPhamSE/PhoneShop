import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://localhost:7026/api/Cart';

  constructor(private http: HttpClient) {}

  getAllCarts(userEmail: string): Observable<any> {
    const url = `${this.apiUrl}/get-cart?userEmail=${encodeURIComponent(
      userEmail
    )}`;
    return this.http.get<any>(url);
  }

  updateQuantity(cartItemId: string, quantity: number): Observable<any> {
    const url = `${this.apiUrl}/update-quantity?cartId=${cartItemId}&quantity=${quantity}`;
    return this.http.put<any>(url, {});
  }

  deleteCartItem(cartItemId: string): Observable<any> {
    const url = `${this.apiUrl}/delete-cart-item?cartItemId=${cartItemId}`;
    return this.http.delete<any>(url);
  }

  addCartItem(
    productId: string,
    userEmail: string,
    quantity: number
  ): Observable<any> {
    const url = `${this.apiUrl}/add-cart-item?userEmail=${encodeURIComponent(
      userEmail
    )}&productd=${productId}&quantity=${quantity}`;
    return this.http.post<any>(url, {});
  }
}
