import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Component,
  ViewChild,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductManageService } from '../../service/product-manage.service';
import { ProductManage } from '../../model/product-manage';
import { BrandManage } from '../../model/brand-manage';

@Component({
  selector: 'app-product-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-manage.component.html',
  styleUrl: './product-manage.component.css',
})
export class ProductManageComponent implements OnInit {
  @ViewChild('myModal') modal: ElementRef | undefined;
  productManages: ProductManage[] = [];
  productService = inject(ProductManageService);
  brandManages: BrandManage[] = [];
  brandNames: { [key: string]: string } = {};

  constructor(private fb: FormBuilder) {}

  productForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.setFormState();
    this.getAllProducts();
    this.getAllBrands();
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

  // getAllProducts() {
  //   this.productService.getAllProducts().subscribe((data) => {
  //     this.productManages = data;
  //   });
  // }
  getAllProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      this.productManages = data;
      this.productManages.forEach((product) => {
        this.getBrandName(product.brandId);
      });
    });
  }

  setFormState() {
    this.productForm = this.fb.group({
      productId: [''],
      brandId: ['', [Validators.required]],
      productName: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      color: ['', [Validators.required]],
      costPrice: ['', [Validators.required]],
      sellPrice: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
    });
  }

  formValues: any;

  // onSubmit() {
  //   console.log(this.productForm.value);
  //   if (this.productForm.invalid) {
  //     alert('Please fill all the fields');
  //     return;
  //   }
  //   this.formValues = this.productForm.value;
  //   if (!this.formValues.ProductId) {
  //     this.formValues.productId = uuidv4(); // Tạo Guid mới nếu id trống
  //   }
  //   console.log('Form Values:', this.formValues); // In ra console để kiểm tra
  //   this.productService.addProduct(this.formValues).subscribe((data) => {
  //     alert('Product added successfully');
  //     this.getAllProducts();
  //     this.productForm.reset();
  //     this.closeModal();
  //   });
  // }
  onSubmit() {
    console.log(this.productForm.value);
    if (this.productForm.invalid) {
      alert('Please fill all the fields');
      return;
    }
    this.formValues = this.productForm.value;
    if (!this.formValues.productId) {
      this.formValues.productId = uuidv4(); // Tạo Guid mới nếu id trống
      this.productService.addProduct(this.formValues).subscribe((data) => {
        alert('Product added successfully');
        this.getAllProducts();
        this.productForm.reset();
        this.closeModal();
      });
    } else {
      this.productService.updateProduct(this.formValues).subscribe((data) => {
        alert('Product updated successfully');
        this.getAllProducts();
        this.productForm.reset();
        this.closeModal();
      });
    }
  }

  onDelete(productManage: ProductManage) {
    const confirmDelete = confirm(
      'Are you sure you want to delete ' + productManage.productName + '?'
    );
    if (confirmDelete) {
      this.productService
        .deleteProduct(productManage.productId)
        .subscribe(() => {
          alert('Product deleted successfully');
          this.getAllProducts();
        });
    }
  }

  // onEdit(productManage: ProductManage) {
  //   this.openModal();
  //   this.productForm.patchValue(productManage);
  // }
  onEdit(productManage: ProductManage) {
    this.productForm.reset();
    this.openModal();
    this.productForm.patchValue({
      productId: productManage.productId,
      brandId: productManage.brandId,
      productName: productManage.productName,
      title: productManage.title,
      description: productManage.description,
      color: productManage.color,
      costPrice: productManage.costPrice,
      sellPrice: productManage.sellPrice,
      stock: productManage.stock,
      imageUrl: productManage.imageUrl,
    });
  }

  getAllBrands() {
    this.productService.getAllBrands().subscribe((data) => {
      this.brandManages = data;
    });
  }
  getBrandName(brandId: string) {
    if (!this.brandNames[brandId]) {
      this.productService.getBrandById(brandId).subscribe((brand) => {
        this.brandNames[brandId] = brand.brandName;
      });
    }
  }
}
