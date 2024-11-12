import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Product } from './models/products';
import { Brands } from './models/brands';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapsed: Record<string, boolean> = {
    categoryPhone: true,
    price: true,
    product: true
  };

  toggleCollapse(category: string): void {
    this.isCollapsed[category] = !this.isCollapsed[category];
  }

  products$?: Observable<Product[]>;   // Các sản phẩm ban đầu
  brands$?: Observable<Brands[]>;      // Các thương hiệu
  filteredBrands$: Observable<Brands[]> = new Observable<Brands[]>();
  filteredProducts: Product[] = [];   // Biến lưu trữ sản phẩm đã lọc
  colors$: Observable<string[]> = new Observable<string[]>();
  selectedBrand: string = '';  // Biến để lưu thương hiệu đã chọn
  selectedColor: string = '';  // Biến để lưu màu sắc đã chọn

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadProducts();
  }

  // Lấy tất cả sản phẩm
  loadProducts(): void {
    this.productService.GetAllProductsAsyncs().subscribe(products => {
      this.filteredProducts = products;  // Lưu tất cả sản phẩm vào filteredProducts
    });
  }

  // Lấy tất cả thương hiệu
  loadBrands(): void {
    this.brands$ = this.productService.GetAllBrandsAsync();
    this.filteredBrands$ = this.brands$.pipe(
      map(brands => this.getUniqueBrands(brands)) // Lọc thương hiệu duy nhất
    );
  }

  // Lọc thương hiệu duy nhất
  getUniqueBrands(brands: Brands[]): Brands[] {
    const uniqueBrands = Array.from(new Set(brands.map(brand => brand.brandName)))
      .map(brandName => {
        return brands.find(brand => brand.brandName === brandName);
      })
      .filter((brand): brand is Brands => brand !== undefined); // Loại bỏ undefined
    return uniqueBrands;
  }

  // Lọc sản phẩm theo thương hiệu và màu sắc
  GetFilteredProducts(): void {
    this.productService.GetFilteredProducts(this.selectedBrand, this.selectedColor).subscribe(products => {
      this.filteredProducts = products; // Cập nhật danh sách sản phẩm đã lọc
    });
  }

  selectBrand(brandName: string): void {
    this.selectedBrand = brandName;
    this.GetFilteredProducts(); // Gọi hàm lọc sản phẩm khi chọn thương hiệu
  }
}
