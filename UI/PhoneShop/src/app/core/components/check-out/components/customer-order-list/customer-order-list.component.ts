import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../features/auth/login/models/user.model';
import { AuthService } from '../../../../../features/auth/services/auth.service';
import { Order } from '../../models/order';
import { ManageOrderService } from '../../services/manager-order/manage-order.service';
import { UserCheckout } from '../../models/user-checkout';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-customer-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-order-list.component.html',
  styleUrl: './customer-order-list.component.css',
})
export class CustomerOrderListComponent implements OnInit {
  userInfo: User | undefined;
  orders: Order[] = [];
  filterOrders: Order[] = [];
  userNames: { [key: string]: string } = {};
  constructor(
    private auth: AuthService,
    private orderService: ManageOrderService
  ) {}
  ngOnInit(): void {
    this.userInfo = this.auth.getUser();
    if (this.userInfo?.email) {
      this.orderService
        .getOrderByEmail(this.userInfo.email)
        .subscribe((data) => {
          this.orders = data;
          this.getOrderByStatus('Pending');
        });
    }
  }

  getUserName(userId: string): string {
    if (!this.userNames[userId]) {
      this.orderService.getUserById(userId).subscribe((user: UserCheckout) => {
        this.userNames[userId] = user.userName;
      });
      return 'Loading...';
    }
    return this.userNames[userId];
  }

  getOrderByStatus(status: string) {
    this.filterOrders = this.orders.filter((order) => order.status === status);
  }
}
