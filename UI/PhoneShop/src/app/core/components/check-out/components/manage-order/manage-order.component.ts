import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order';
import { ManageOrderService } from '../../services/manager-order/manage-order.service';
import { UserCheckout } from '../../models/user-checkout';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.css',
})
export class ManageOrderComponent implements OnInit {
  orders: Order[] = [];
  userNames: { [key: string]: string } = {};
  constructor(private orderService: ManageOrderService) {}
  ngOnInit() {
    this.getAllOrders();
  }
  getAllOrders() {
    this.orderService.getAllOrders().subscribe((data) => {
      this.orders = data;
    });
  }
  getOrderByStatus(status: string) {
    this.orderService.getOrderByStatus(status).subscribe((data) => {
      this.orders = data;
    });
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
}
