import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Brand } from './model/brand';
import { CategoryService } from './service/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  @ViewChild('myModal') model: ElementRef | undefined;
  brandList: Brand[] = [];
  brandForm: FormGroup = new FormGroup({});
  brandService = inject(CategoryService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.setFormState();
    this.getBrands();
  }

  openModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    this.setFormState();
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  getBrands() {
    this.brandService.getAllBrand().subscribe((res) => {
      this.brandList = res;
    });
  }

  setFormState() {
    this.brandForm = this.fb.group({
      brandId: [0],
      brandName: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.brandForm.invalid) {
      alert('Please fill all fields');
      return;
    }

    const formValues = this.brandForm.value;
    if (formValues.brandId === 0) {
      this.brandService.addBrand(formValues).subscribe(() => {
        alert('Brand added successfully');
        this.getBrands();
        this.brandForm.reset();
        this.closeModal();
      });
    } else {
      this.brandService.updateBrand(formValues).subscribe(() => {
        alert('Brand updated successfully');
        this.getBrands();
        this.brandForm.reset();
        this.closeModal();
      });
    }
  }

  OnEdit(brand: Brand) {
    this.openModal();
    this.brandForm.patchValue(brand);
  }

  onDelete(brand: Brand) {
    if (
      confirm(`Are you sure you want to delete the brand "${brand.brandName}"?`)
    ) {
      this.brandService.deleteBrand(brand.brandId).subscribe(() => {
        alert('Brand deleted successfully');
        this.getBrands();
      });
    }
  }
}
