import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand } from '../model/brand';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://localhost:7026/api/Brand';

  constructor(private http: HttpClient) {}

  getAllBrand() {
    return this.http.get<Brand[]>(this.apiUrl);
  }

  addBrand(data: any) {
    return this.http.post(this.apiUrl, data);
  }
  updateBrand(brand: Brand) {
    return this.http.put(`${this.apiUrl}/${brand.brandId}`, brand);
  }
  deleteBrand(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
