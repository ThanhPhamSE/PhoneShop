import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { ProductDetailService } from '../product-detail/service/product-detail.service';
import { Product } from './models/product';
import { Review } from './models/review';
import { RouterModule } from '@angular/router';  // Import RouterModule
import { CartService } from '../Cart/service/cart.service';
import { User } from '../../../features/auth/login/models/user.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,  // Mark this component as standalone
  imports: [CommonModule, FormsModule, RouterModule],  // Import FormsModule here
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  productId: string | null = null;
  brandName: string = ''; // Để lưu trữ tên thương hiệu
  quantity: number = 1;
  previousUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productDetailService: ProductDetailService,
    private cartService: CartService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.previousUrl = this.router.getCurrentNavigation()?.extras.state?.['previousUrl'] || null;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['productId'];

      if (this.productId) {
        this.productDetailService.getProductById(this.productId).subscribe(
          (product) => {
            this.product = product;
          },
          (error) => {
            console.error('Error fetching product', error);
          }
        );

        this.productDetailService.getReviewsByProductId(this.productId).subscribe(
          (reviews) => {
            this.reviews = reviews.map(review => ({
              ...review,
              ReviewDate: review.reviewDate // Giữ nguyên ReviewDate dưới dạng string
            }));
          },
          (error) => {
            console.error('Error fetching reviews', error);
          }
        );
      }
    });
  }

  increaseQuantity() {
    console.log("Increasing quantity...");
    this.quantity = Math.max(this.quantity + 1, 1);  // Đảm bảo quantity không dưới 1
  }

  decreaseQuantity() {
    console.log("Decreasing quantity...");
    this.quantity = Math.max(this.quantity - 1, 1);  // Đảm bảo quantity không dưới 1
  }

  onQuantityChange(value: string) {
    console.log("Quantity changed to: ", value);
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue) || parsedValue < 1) {
      this.quantity = 1;  // Nếu giá trị không hợp lệ, đặt lại quantity về 1
    } else {
      this.quantity = parsedValue;  // Cập nhật quantity với giá trị nhập vào
    }
  }

  goBack(): void {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl); // Điều hướng về trang trước
    } else {
      this.router.navigate(['/']); // Nếu không có trang trước, về Home
    }
  }

}