import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ProductManageService } from '../../../../core/components/product-manage/service/product-manage.service';
import { Cart } from '../../model/cart';
import { ProductManage } from '../../../../core/components/product-manage/model/product-manage';
import { User } from '../../../auth/login/models/user.model';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  products: ProductManage[] = [];
  carts: Cart[] = [];
  userInfo: User | undefined;

  auth = inject(AuthService);
  cartservice = inject(CartService);
  productService = inject(ProductManageService);

  ngOnInit(): void {
    this.userInfo = this.auth.getUser();
    this.cartservice
      .getAllCarts(this.userInfo?.email ?? '')
      .subscribe((data) => {
        this.carts = data;
        this.getProductsInCart();
      });
  }

  getProductsInCart(): void {
    const productObservables: Observable<ProductManage>[] = this.carts.map(
      (cart) => this.productService.getProductById(cart.productId)
    );

    forkJoin(productObservables).subscribe((products) => {
      this.products = products;
    });
  }

  updateQuantity(cart: Cart, one: number): void {
    const originalQuantity = cart.quantity;
    cart.quantity += one;

    this.cartservice.updateQuantity(cart.cartItemId, one).subscribe({
      error: () => {
        cart.quantity = originalQuantity;
      },
      complete: () => {
        this.refreshCarts();
      },
    });
  }

  private refreshCarts(): void {
    this.cartservice
      .getAllCarts(this.userInfo?.email ?? '')
      .subscribe((data) => {
        this.carts = data;
        this.getProductsInCart();
      });
  }

  deleteCartItem(cart: Cart): void {
    this.cartservice.deleteCartItem(cart.cartItemId).subscribe({
      complete: () => {
        this.refreshCarts();
      },
    });
  }

  getTotalPrice(): number {
    return this.carts.reduce((total, cart, index) => {
      const product = this.products[index];
      return total + (product ? product.sellPrice * cart.quantity : 0);
    }, 0);
  }
}
