import { Component, inject, OnInit } from '@angular/core';
import { Cart } from '../../model/cart';
import { forkJoin, Observable } from 'rxjs';
import { CartService } from '../../service/cart.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/login/models/user.model';
import { ProductManage } from '../../../../core/components/product-manage/model/product-manage';
import { ProductManageService } from '../../../../core/components/product-manage/service/product-manage.service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  products: ProductManage[] = [];
  productService = inject(ProductManageService);
  carts: Cart[] = [];
  userInfo: User | undefined;
  constructor(private auth: AuthService, private cartservice: CartService) {}

  ngOnInit(): void {
    this.userInfo = this.auth.getUser();
    this.cartservice
      .getAllCarts(this.userInfo?.email ?? '')
      .subscribe((data) => {
        this.carts = data;
      });
  }

  updateQuantity(cart: Cart, one: number): void {
    const originalQuantity = cart.quantity;
    cart.quantity += one;

    this.cartservice.updateQuantity(cart.cartItemId, one).subscribe({
      error: () => {
        // Hoàn tác thay đổi nếu có lỗi
        cart.quantity = originalQuantity;
      },
      complete: () => {
        // Làm mới danh sách giỏ hàng nếu cần thiết
        this.refreshCarts();
      },
    });
  }

  private refreshCarts(): void {
    this.cartservice
      .getAllCarts(this.userInfo?.email ?? '')
      .subscribe((data) => {
        this.carts = data;
      });
  }

  deleteCartItem(cart: Cart): void {
    this.cartservice.deleteCartItem(cart.cartItemId).subscribe({
      complete: () => {
        this.refreshCarts();
      },
    });
  }
}
