import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  inject,
} from '@angular/core';
import { ApiService } from './call-address-api.service';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../Cart/service/cart.service';
import { Cart } from '../../../Cart/model/cart';
import { ProductManage } from '../../../product-manage/model/product-manage';
import { ProductManageService } from '../../../product-manage/service/product-manage.service';
import { User } from '../../../../../features/auth/login/models/user.model';
import { AuthService } from '../../../../../features/auth/services/auth.service';
import { Address } from '../../models/address';
import { ConfirmOrderService } from '../../services/confirm-order/confirm-order.service';
@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css',
})
export class ConfirmOrderComponent implements OnInit {
  @ViewChild('myModal') modal: ElementRef | undefined;
  products: ProductManage[] = [];
  carts: Cart[] = [];
  userInfo: User | undefined;
  addresss!: Address;

  auth = inject(AuthService);
  cartservice = inject(CartService);
  productService = inject(ProductManageService);
  confirmOrderService = inject(ConfirmOrderService);
  date!: string;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService
      .callAPI('https://provinces.open-api.vn/api/?depth=1')
      .then((response: any) => {
        this.renderData(response.data, 'province');
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    this.addEventListeners();
    this.userInfo = this.auth.getUser();
    this.cartservice
      .getAllCarts(this.userInfo?.email ?? '')
      .subscribe((data) => {
        this.carts = data;
        this.getProductsInCart();
      });
    this.getAdressByEmail(this.userInfo?.email ?? '');
    const today = new Date();
    this.date = today.toLocaleDateString();
  }

  getAdressByEmail(email: string) {
    this.confirmOrderService
      .getAddressByEmail(email)
      .subscribe((data) => (this.addresss = data));
  }

  getTotalPrice(): number {
    return this.carts.reduce((total, cart, index) => {
      const product = this.products[index];
      return total + (product ? product.sellPrice * cart.quantity : 0);
    }, 0);
  }

  getProductsInCart(): void {
    const productObservables: Observable<ProductManage>[] = this.carts.map(
      (cart) => this.productService.getProductById(cart.productId)
    );

    forkJoin(productObservables).subscribe((products) => {
      this.products = products;
    });
  }

  openModal() {
    const productModal = document.getElementById('myModal');
    if (productModal != null) {
      productModal.style.display = 'block';
    }
  }

  closeModal() {
    this.setFormState();
    if (this.modal != null) {
      this.modal.nativeElement.style.display = 'none';
    }
  }

  setFormState() {}

  addEventListeners() {
    const provinceSelect = document.querySelector('#province');
    const districtSelect = document.querySelector('#district');

    if (provinceSelect) {
      provinceSelect.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLSelectElement;
        const provinceCode = target.value;
        this.apiService
          .callAPI(
            `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
          )
          .then((response: any) => {
            this.renderData(response.data.districts, 'district');
          })
          .catch((error) => {
            console.error('Error fetching districts:', error);
          });
      });
    }

    if (districtSelect) {
      districtSelect.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLSelectElement;
        const districtCode = target.value;
        this.apiService
          .callAPI(
            `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
          )
          .then((response: any) => {
            this.renderData(response.data.wards, 'ward');
          })
          .catch((error) => {
            console.error('Error fetching wards:', error);
          });
      });
    }
  }

  renderData(array: any[], select: string) {
    let row = '<option disabled value="">chọn</option>';
    array.forEach((element) => {
      row += `<option value="${element.code}">${element.name}</option>`;
    });
    const selectElement = document.querySelector('#' + select);
    if (selectElement) {
      selectElement.innerHTML = row;
    }
  }
}
