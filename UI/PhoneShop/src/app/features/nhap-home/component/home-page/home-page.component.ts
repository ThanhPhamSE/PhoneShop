import { Component, OnInit, inject } from '@angular/core';
import { ProductManageService } from '../../../../core/components/product-manage/service/product-manage.service';
import { ProductManage } from '../../../../core/components/product-manage/model/product-manage';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/login/models/user.model';
import { Cart } from '../../model/cart';
import { CartService } from '../../service/cart.service';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  products: ProductManage[] = [];
  userInfo: User | undefined;
  carts: Cart[] = [];
  constructor(
    private productManageService: ProductManageService,
    private auth: AuthService,
    private cartservice: CartService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.auth.getUser();
    this.productManageService.getAllProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addToCart(userEmail: string, productId: string, quantity: number): void {
    if (userEmail) {
      console.log(
        `Adding to cart: ${productId}, Quantity: ${quantity}, User: ${userEmail}`
      );
      this.cartservice.addCartItem(productId, userEmail, quantity).subscribe(
        () => {
          alert('Item added to cart successfully');
        },
        (error) => {
          alert('Error adding item to cart:' + error);
        }
      );
    } else {
      alert('User email is not available');
    }
  }
}
