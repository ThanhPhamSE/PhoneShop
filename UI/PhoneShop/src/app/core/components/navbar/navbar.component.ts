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
  brands$?: Observable<Brands[]>;       // Các thương hiệu
  filteredBrands$: Observable<Brands[]> = new Observable<Brands[]>();
  allProducts: Product[] = [];          // Danh sách tất cả sản phẩm
  filteredProducts: Product[] = [];     // Sản phẩm sau khi áp dụng phân trang
  colors$: Observable<string[]> = new Observable<string[]>();
  selectedBrand: string = '';           // Biến để lưu thương hiệu đã chọn
  selectedColor: string = '';           // Biến để lưu màu sắc đã chọn
  pageSize: number = 12;                // Chỉ 12 sản phẩm mỗi trang
  currentPage: number = 1;              // Trang hiện tại
  totalPages: number = 1;               // Tổng số trang

  constructor(private productService: ProductService) { }
  pages: number[] = []; // Mảng số trang

  ngOnInit(): void {
    this.loadBrands();
    this.loadProducts();
  }

  // Lấy tất cả sản phẩm
  loadProducts(): void {
    this.productService.GetAllProductsAsyncs().subscribe(products => {
      this.allProducts = products;               // Lưu tất cả sản phẩm
      this.updateFilteredProducts();             // Cập nhật sản phẩm cho trang đầu tiên
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
    this.productService.GetFilteredProducts(this.selectedBrand, this.selectedColor, this.currentPage, this.pageSize).subscribe(products => {
      this.allProducts = products;                // Cập nhật tất cả sản phẩm đã lọc
      this.updateFilteredProducts();              // Cập nhật sản phẩm phân trang
    });
  }

  // Cập nhật danh sách sản phẩm hiển thị theo trang hiện tại
  updateFilteredProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredProducts = this.allProducts.slice(startIndex, endIndex);

    // Cập nhật tổng số trang và mảng số trang
    this.totalPages = Math.ceil(this.allProducts.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1); // Tạo danh sách số trang
  }
  // Chọn thương hiệu và gọi lọc sản phẩm
  selectBrand(brandName: string): void {
    this.selectedBrand = brandName;
    console.log('Selected Brand:', this.selectedBrand); // Kiểm tra thương hiệu đã chọn
    this.GetFilteredProducts();
  }


  // Điều hướng qua lại giữa các trang
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredProducts();
    }
  }

  // Các hàm để điều hướng trang trước và sau
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredProducts();
    }
  }
}
