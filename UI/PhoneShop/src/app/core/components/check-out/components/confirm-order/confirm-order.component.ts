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

  onSubmit() {
    // Generate a new GUID for addressId
    const newAddressId = uuidv4();
    this.getUserByEmail(this.userInfo?.email ?? '');
    // Ensure userId and addressId are included in the form values
    this.addresstForm.patchValue({
      addressId: newAddressId,
      userId: this.userCheckout.userId,
    });

    console.log('Form Values:', this.addresstForm.value);

    if (this.addresstForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    this.formValues = this.addresstForm.value;
    this.confirmOrderService.addAddress(this.formValues).subscribe((data) => {
      alert('Đã thêm địa chỉ');
      this.getAdressByEmail(this.userInfo?.email ?? '');
      this.addresstForm.reset();
      this.closeModal();
    });
  }

  getUserByEmail(email: string) {
    this.confirmOrderService
      .getUserByEmail(email)
      .subscribe((data) => (this.userCheckout = data));
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
