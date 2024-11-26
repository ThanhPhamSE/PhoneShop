import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReviewUserService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  addReview(productId: string, reviewData: { userId: string; rating: number; comment: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/ProductDetail/add-review-by-product-id/${productId}`, reviewData);
  }
}
