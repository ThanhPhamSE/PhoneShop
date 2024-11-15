import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from './models/products';
import { Brand } from './models/brand';
import { HomePageService } from './services/home-page.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from './models/apiResponse';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  // Các observable cho sản phẩm và thương hiệu
  products$: Observable<Product[]> = new Observable<Product[]>();
  brands$: Observable<Brand[]> = new Observable<Brand[]>();

  // Biến để lưu các tham số filter, search, sort
  searchQuery: string = '';   // Từ khóa tìm kiếm
  selectedBrand: string = ''; // Thương hiệu được chọn
  fromPrice: number | null = null; // Giá từ
  toPrice: number | null = null;   // Giá đến
  sortOption: string = '';   // Sắp xếp theo (ví dụ: "gia_esc" hoặc "gia_desc")

  // Tổng số trang
  productsPerPage: number = 6;  // Số sản phẩm mỗi trang
  currentPage = 1;
  totalPages = 0; // Tổng số trang (được tính từ backend, không tính lại nữa)
  totalCount = 0; // Tổng số sản phẩm (để tính toán tổng số trang nếu cần thiết)
  pages: number[] = []; // Mảng các trang
  filteredProducts: Product[] = []; // Sản phẩm hiện tại sau khi phân trang

  // Thuộc tính điều khiển trạng thái gập/đổ cho các danh mục
  isCollapsed: { [key: string]: boolean } = {};  // Track collapse state for each category

  constructor(private homeService: HomePageService) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadProducts();  // Kiểm tra dữ liệu ngay khi component khởi tạo
  }

  loadProducts(): void {
    console.log('Sending request for page', this.currentPage);

    this.products$ = this.homeService.getProducts(
      this.searchQuery,
      this.fromPrice,
      this.toPrice,
      this.sortOption,
      this.currentPage,
      this.selectedBrand,
      this.productsPerPage
    ).pipe(
      map((response: ApiResponse) => {
        console.log('API response:', response);

        if (response && response.products && response.products.length > 0) {
          // Cập nhật các giá trị từ API
          this.totalCount = response.totalCount;
          this.totalPages = response.totalPages;  // Lấy totalPages trực tiếp từ API
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1); // Mảng các trang

          this.filteredProducts = response.products;  // Lưu danh sách sản phẩm đã phân trang

          return response.products;
        }

        return [];  // Trả về mảng rỗng nếu không có sản phẩm
      }),
      catchError((error) => {
        console.error('Error fetching products:', error);
        return of([]);  // Trả về mảng rỗng khi có lỗi
      })
    );
  }

  // Tải danh sách thương hiệu
  loadBrands(): void {
    this.brands$ = this.homeService.GetAllBrandsAsync();
  }

  // Thực hiện tìm kiếm sản phẩm theo từ khóa
  onSearchChange(): void {
    this.currentPage = 1;  // Quay lại trang đầu tiên khi thay đổi từ khóa tìm kiếm
    this.loadProducts();
  }

  // Thay đổi thương hiệu lọc và tải lại sản phẩm
  selectBrand(brandName: string): void {
    console.log('Selected brand:', brandName);
    this.selectedBrand = brandName;
    this.currentPage = 1;  // Quay lại trang đầu tiên khi thay đổi thương hiệu
    console.log('Loading products with:', this.selectedBrand);
    this.loadProducts();
  }

  // Thay đổi giá lọc và tải lại sản phẩm
  onPriceChange(): void {
    this.currentPage = 1;  // Quay lại trang đầu tiên khi thay đổi giá
    this.loadProducts();
  }

  // Thay đổi sắp xếp và tải lại sản phẩm
  onSortChange(): void {
    this.currentPage = 1;  // Quay lại trang đầu tiên khi thay đổi sắp xếp
    this.loadProducts();
  }

  // Điều hướng qua lại giữa các trang
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;  // Cập nhật trang hiện tại
      this.loadProducts();  // Gọi lại loadProducts để tải dữ liệu cho trang mới
    }
  }

  // Điều hướng đến trang kế tiếp
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts(); // Gọi loadProducts để tải dữ liệu trang mới
    }
  }

  // Điều hướng đến trang trước
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts(); // Gọi loadProducts để tải dữ liệu trang mới
    }
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedBrand = '';
    this.fromPrice = null;
    this.toPrice = null;
    this.sortOption = '';
    this.currentPage = 1;
    this.loadProducts();
  }

  // Hàm toggleCollapse để điều khiển trạng thái gập/đổ của các danh mục
  toggleCollapse(category: string): void {
    this.isCollapsed[category] = !this.isCollapsed[category];
  }

  pagesToShow(): number[] {
    const pagesToShow: number[] = [];

    const startPage = Math.max(1, this.currentPage - 2); // Tạo trang bắt đầu
    const endPage = Math.min(this.totalPages, this.currentPage + 2); // Tạo trang kết thúc

    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    return pagesToShow;
  }

}
