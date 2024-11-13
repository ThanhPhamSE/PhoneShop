import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductManage } from '../model/product-manage';
import { BrandManage } from '../model/brand-manage';
@Injectable({
  providedIn: 'root',
})
export class ProductManageService {
  private apiUrl = 'https://localhost:7026/api/ProductManage';

  constructor() {}

  http = inject(HttpClient);

  getAllProducts() {
    return this.http.get<ProductManage[]>(`${this.apiUrl}/get-all-products`);
  }

  addProduct(data: any) {
    return this.http.post(`${this.apiUrl}/add-product`, data);
  }

  updateProduct(productManage: ProductManage) {
    return this.http.put(
      `${this.apiUrl}/update-product-by-id/${productManage.productId}`,
      productManage
    );
  }

  deleteProduct(productId: string) {
    return this.http.delete(`${this.apiUrl}/delete-product-by-id/${productId}`);
  }

  getAllBrands() {
    return this.http.get<BrandManage[]>(`${this.apiUrl}/get-all-brands`);
  }

  getBrandById(brandId: string) {
    return this.http.get<BrandManage>(
      `${this.apiUrl}/get-brand-by-id/${brandId}`
    );
  }
}
