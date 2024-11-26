import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { UserCheckout } from '../../models/user-checkout';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css',
})
export class ConfirmOrderComponent implements OnInit {
  @ViewChild('myModal') modal: ElementRef | undefined;
  products: ProductManage[] = [];
  carts: Cart[] = [];
  userInfo: User | undefined;
  addresss!: Address;
  userCheckout!: UserCheckout;

  auth = inject(AuthService);
  cartservice = inject(CartService);
  productService = inject(ProductManageService);
  confirmOrderService = inject(ConfirmOrderService);
  date!: string;
  city!: string;
  district!: string;
  village!: string;

  formValues: Address = {} as Address;

  addresstForm: FormGroup = new FormGroup({});
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

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
    this.getUserByEmail(this.userInfo?.email ?? '');
    const today = new Date();
    this.date = today.toLocaleDateString();
    this.setFormState();
  }

  // onSubmit() {
  //   // Generate a new GUID for addressId
  //   const newAddressId = uuidv4();
  //   this.getUserByEmail(this.userInfo?.email ?? '');
  //   // Ensure userId and addressId are included in the form values
  //   this.addresstForm.patchValue({
  //     addressId: newAddressId,
  //     userId: this.userCheckout.userId,
  //   });

  //   console.log('Form Values:', this.addresstForm.value);

  //   if (this.addresstForm.invalid) {
  //     alert('Vui lòng điền đầy đủ thông tin');
  //     return;
  //   }

  //   this.formValues = this.addresstForm.value;
  //   this.confirmOrderService.addAddress(this.formValues).subscribe((data) => {
  //     alert('Đã thêm địa chỉ');
  //     this.getAdressByEmail(this.userInfo?.email ?? '');
  //     this.addresstForm.reset();
  //     this.closeModal();
  //   });
  // }
  onSubmit(action: string) {
    if (action === 'save') {
      // Generate a new GUID for addressId
      const newAddressId = uuidv4();
      this.getUserByEmail(this.userInfo?.email ?? '');
      // Ensure userId and addressId are included in the form values
      this.addresstForm.patchValue({
        addressId: newAddressId,
        userId: this.userCheckout.userId,
      });

      console.log('Form Values for Save:', this.addresstForm.value);

      if (this.addresstForm.invalid) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }

      this.formValues = this.addresstForm.value;
      this.confirmOrderService.addAddress(this.formValues).subscribe(
        (data) => {
          alert('Đã thêm địa chỉ');
          this.getAdressByEmail(this.userInfo?.email ?? '');
          this.addresstForm.reset();
          this.closeModal();
        },
        (error) => {
          console.error('Error adding address:', error);
          alert('Có lỗi xảy ra khi thêm địa chỉ');
        }
      );
    } else if (action === 'update') {
      // Ensure userId is included in the form values
      this.addresstForm.patchValue({
        userId: this.userCheckout.userId,
        addressId: this.addresss.addressId,
      });

      console.log('Form Values for Update:', this.addresstForm.value);

      if (this.addresstForm.invalid) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }

      this.confirmOrderService.updateAddress(this.addresstForm.value).subscribe(
        (data) => {
          alert('Đã cập nhật địa chỉ');
          this.getAdressByEmail(this.userInfo?.email ?? '');
          this.addresstForm.reset();
          this.closeModal();
        },
        (error) => {
          console.error('Error updating address:', error);
          alert('Có lỗi xảy ra khi cập nhật địa chỉ');
        }
      );
    }
  }

  getUserByEmail(email: string) {
    this.confirmOrderService
      .getUserByEmail(email)
      .subscribe((data) => (this.userCheckout = data));
  }

  getAdressByEmail(email: string) {
    this.confirmOrderService
      .getAddressByEmail(email)
      .subscribe(
        (data) => (
          (this.addresss = data),
          (this.city = data.city.split('.')[1]),
          (this.district = data.district.split('.')[1]),
          (this.village = data.village.split('.')[1])
        )
      );
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

  setFormState() {
    this.addresstForm = this.fb.group({
      addressId: [''], // Initialize with an empty string
      userId: [''],
      city: ['', [Validators.required]],
      district: ['', [Validators.required]],
      village: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  addEventListeners() {
    const provinceSelect = document.querySelector('#province');
    const districtSelect = document.querySelector('#district');

    if (provinceSelect) {
      provinceSelect.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLSelectElement;
        const [provinceCode, provinceName] = target.value.split('.'); // Tách mã và tên tỉnh
        console.log('Selected Province:', { provinceCode, provinceName });

        this.apiService
          .callAPI(
            `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
          )
          .then((response: any) => {
            this.renderData(
              response.data.districts.map((district: any) => ({
                code: district.code,
                name: district.name,
              })),
              'district'
            );
          })
          .catch((error) => {
            console.error('Error fetching districts:', error);
          });
      });
    }

    if (districtSelect) {
      districtSelect.addEventListener('change', (event: Event) => {
        const target = event.target as HTMLSelectElement;
        const [districtCode, districtName] = target.value.split('.'); // Tách mã và tên quận/huyện
        console.log('Selected District:', { districtCode, districtName });

        this.apiService
          .callAPI(
            `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
          )
          .then((response: any) => {
            this.renderData(
              response.data.wards.map((ward: any) => ({
                code: ward.code,
                name: ward.name,
              })),
              'ward'
            );
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
      row += `<option value="${element.code}.${element.name}">${element.name}</option>`;
    });
    const selectElement = document.querySelector('#' + select);
    if (selectElement) {
      selectElement.innerHTML = row;
    }
  }

  placeOrder() {
    const totalAmount = this.getTotalPrice();
    const orderDate = new Date().toISOString(); // Use ISO string format for date
    const orderId = uuidv4();
    const userId = this.userCheckout.userId;
    const status = 'Pending';
    const order = { orderId, userId, orderDate, totalAmount, status };

    console.log('Order Data:', order);

    this.confirmOrderService.addOrder(order).subscribe(
      (data) => {
        console.log('Order added:', data);
        this.carts.forEach((cart, index) => {
          const product = this.products[index];
          const orderItemId = uuidv4();
          const orderItem = {
            orderItemId,
            orderId,
            productId: cart.productId,
            quantity: cart.quantity,
            price: product.sellPrice,
            consignee: 'None',
          };

          console.log('Order Item Data:', orderItem);

          this.confirmOrderService.addOrderItem(orderItem).subscribe(
            (data) => {
              console.log('Order item added:', data);
              // Update product quantity
              const newQuantity = product.stock - cart.quantity;
              const updatedProduct = { ...product, stock: newQuantity };
              this.confirmOrderService
                .updateProductQuantity(updatedProduct)
                .subscribe(
                  (data) => {
                    console.log('Product quantity updated:', data);
                  },
                  (error) => {
                    console.error('Error updating product quantity:', error);
                  }
                );
            },
            (error) => {
              console.error('Error adding order item:', error);
            }
          );
        });

        alert('Đã đặt hàng thành công');
        this.cartservice.deleteAllCarts(this.userInfo?.email ?? '').subscribe(
          () => {
            console.log('All carts deleted');
          },
          (error) => {
            console.error('Error deleting carts:', error);
          }
        );
      },
      (error) => {
        console.error('Error adding order:', error);
        alert('Có lỗi xảy ra khi đặt hàng');
      }
    );
  }
}
