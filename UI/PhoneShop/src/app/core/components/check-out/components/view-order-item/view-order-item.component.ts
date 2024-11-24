import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderItem } from '../../models/orderItem';
import { ManageOrderService } from '../../services/manager-order/manage-order.service';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order';
import { ProductManage } from '../../../product-manage/model/product-manage';
import { User } from '../../../../../features/auth/login/models/user.model';
import { AuthService } from '../../../../../features/auth/services/auth.service';
@Component({
  selector: 'app-view-order-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-order-item.component.html',
  styleUrls: ['./view-order-item.component.css'],
})
export class ViewOrderItemComponent implements OnInit {
  orderItems: OrderItem[] = [];
  order!: Order;
  orderId!: string;
  userInfo: User | undefined;

  auth = inject(AuthService);
  productMap: {
    [key: string]: {
      name: string;
      title: string;
      color: string;
      imageUrl: string;
    };
  } = {};
  address: {
    [key: string]: {
      city: string;
      district: string;
      village: string;
      description: string;
    };
  } = {};
  userName: { [key: string]: string } = {};
  constructor(
    private route: ActivatedRoute,
    private manageOrderService: ManageOrderService
  ) {}

  ngOnInit() {
    this.userInfo = this.auth.getUser();
    this.route.queryParams.subscribe((params) => {
      this.orderId = params['orderId'];
      this.loadOrderItems();
      this.loadOrder();
    });
  }

  loadOrderItems() {
    if (this.orderId) {
      this.manageOrderService.getOrderItemById(this.orderId).subscribe(
        (data) => {
          this.orderItems = data;
          this.orderItems.forEach((item) => {
            this.getProductDetailsById(item.productId);
          });
        },
        (error) => {
          console.error('Error fetching order items:', error);
        }
      );
    }
  }

  loadOrder() {
    this.manageOrderService.getOrderById(this.orderId).subscribe(
      (data) => {
        this.order = data;
        this.getAddressByUserId(this.order.userId);
        this.getUserByUserId(this.order.userId);
      },
      (error) => {
        console.error('Error fetching order:', error);
      }
    );
  }

  getProductDetailsById(productId: string) {
    if (!this.productMap[productId]) {
      this.manageOrderService.getProductById(productId).subscribe(
        (data: ProductManage) => {
          this.productMap[productId] = {
            name: data.productName,
            title: data.title,
            color: data.color,
            imageUrl: data.imageUrl,
          }; // Lưu thông tin vào map
        },
        (error) => {
          console.error('Error fetching product:', error);
        }
      );
    }
  }

  getAddressByUserId(userId: string) {
    if (!this.address[userId]) {
      this.manageOrderService.getAddressByUserId(userId).subscribe(
        (data) => {
          this.address[userId] = {
            city: data.city,
            district: data.district,
            village: data.village,
            description: data.description,
          };
        },
        (error) => {
          console.error('Error fetching address:', error);
        }
      );
    }
  }

  getUserByUserId(userId: string) {
    if (!this.userName[userId]) {
      this.manageOrderService.getUserById(userId).subscribe(
        (data) => {
          this.userName[userId] = data.userName;
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }

  isUserWithPendingOrder(): boolean {
    return !!(
      this.userInfo?.roles?.includes('User') && this.order?.status === 'Pending'
    );
  }

  isAdminWithPendingOrder(): boolean {
    return !!(
      this.userInfo?.roles?.includes('Admin') &&
      this.order?.status === 'Pending'
    );
  }

  isAdminWithCancelationRequest(): boolean {
    return !!(
      this.userInfo?.roles?.includes('Admin') &&
      this.order?.status === 'Cancelation Request'
    );
  }

  isAdminWithDeniedOrder(): boolean {
    return !!(
      this.userInfo?.roles?.includes('Admin') && this.order?.status === 'Denied'
    );
  }
}
