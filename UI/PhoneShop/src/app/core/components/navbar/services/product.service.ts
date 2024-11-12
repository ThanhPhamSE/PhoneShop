import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../models/products';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Brands } from '../models/brands';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient,
    private cookieService: CookieService
  ) { }

  GetAllProductsAsyncs(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/Home/products`);
  }
  GetAllBrandsAsync(): Observable<Brands[]> {
    return this.http.get<Brands[]>(`${environment.apiUrl}/api/Home/products/filter`);
  }
  GetFilteredProducts(brandName: string, color: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/api/Home/products/filter?brandName=${brandName}&color=${color}`);
  }
}

