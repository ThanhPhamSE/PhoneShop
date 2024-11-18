import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../models/product';
import { environment } from '../../../../environments/environment.development';
import { Review } from '../models/review';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Lấy sản phẩm theo ProductId
  getProductById(productId: string) {
    return this.http.get<Product>(`${environment.apiUrl}/api/ProductDetail/get-product-by-id/${productId}`);
  }

  // Lấy tất cả đánh giá của sản phẩm theo ProductId
  getReviewsByProductId(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/api/ProductDetail/get-reviews-by-product-id/${productId}`);
  }
}
