import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Product } from '../models/products';
import { Brand } from '../models/brand';
import { ApiResponse } from '../models/apiResponse';  // Cập nhật ApiResponse

@Injectable({
  providedIn: 'root'
})
export class HomePageService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Chỉnh sửa lại hàm getProducts để hỗ trợ phân trang và trả về tổng số trang
  getProducts(
    search: string = '',
    from: number | null = null,
    to: number | null = null,
    sort: string | null = null,
    page: number,
    brand: string = '',
    pageSize: number = 6  // Default page size is 6
  ): Observable<ApiResponse> {  // Chắc chắn ApiResponse đã có các trường products, page, và totalPages
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (from !== null) {
      params = params.set('from', from.toString());
    }
    if (to !== null) {
      params = params.set('to', to.toString());
    }
    if (sort) {
      params = params.set('sort', sort);  // Thay 'sortBy' thành 'sort' nếu đúng vậy
    }
    if (brand && brand.trim() !== '') {
      params = params.set('brand', brand);
    }

    console.log('Sending request with params:', params.toString());

    return this.http.get<ApiResponse>(`${environment.apiUrl}/api/Home/get-all-products`, { params });
  }

  getAllProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/Home`);
  }

  GetAllBrandsAsync(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${environment.apiUrl}/api/Home/get-all-brands`);
  }
}
