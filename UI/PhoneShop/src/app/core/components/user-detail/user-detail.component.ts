import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Để lấy tham số từ URL
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserDetailService } from '../user-detail/services/user-detail.service';
import { UpdateUserAndAddress } from '../user-detail/models/updateUserAndAddress';
import { ChangePassword } from '../user-detail/models/changePassword';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'], // Sửa tên thành "styleUrls"
})
export class UserDetailComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;
  userDetail: { User: any; Address: any } | null = null; // Rõ ràng hơn về kiểu dữ liệu
  email: string | null = null; // Biến để lưu email từ URL
  userEmail: string | null = localStorage.getItem('user-email');

  constructor(
    private fb: FormBuilder,
    private userService: UserDetailService,
    private route: ActivatedRoute // Inject ActivatedRoute để lấy tham số từ URL
  ) {
    this.userForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], // Không cho phép chỉnh sửa email
      userName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      village: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.passwordForm = this.fb.group(
      {
        email: [this.userEmail, [Validators.required, Validators.email]],
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator // Custom validator cho form group
      }
    );

  }
  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    // Lấy email từ URL khi component được khởi tạo
    this.email = this.route.snapshot.paramMap.get('email'); // email là tham số trong URL

    if (this.email) {
      // Nếu email tồn tại trong URL, gọi API để lấy thông tin người dùng
      this.getUserDetails(this.email);
    } else {
      alert('Email not provided in the URL');
    }
  }

  getUserDetails(email: string): void {
    if (!email) {
      this.userDetail = null;
      return;
    }

    this.userService.getUserByEmail(email).subscribe(
      (response) => {
        console.log('Response from API:', response); // Kiểm tra dữ liệu nhận được
        console.log('Email from API:', response.user.email); // Kiểm tra nếu email có tồn tại

        this.userDetail = response;
        this.userForm.patchValue({
          email: response.user.email || '',
          userName: response.user.userName || '', // Chắc chắn gán đúng đường dẫn
          phoneNumber: response.user.phoneNumber || '',
          city: response.address?.city || '',
          district: response.address?.district || '',
          village: response.address?.village || '',
          description: response.address?.description || ''
        });
      },
      (error) => {
        console.error(error);
        if (error.status === 404) {
          alert('User not found with the specified email.');
        } else {
          alert('An error occurred while fetching user details.');
        }
      }
    );
  }


  updateUserDetails(): void {
    if (this.userForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const email = this.userForm.get('email')?.value;
    const updateModel = { ...this.userForm.getRawValue() }; // Lấy cả giá trị `disabled` fields
    delete updateModel.email; // Loại bỏ email khỏi dữ liệu gửi đi

    this.userService.updateUserByEmail(email, updateModel).subscribe(
      (response) => {
        alert('User details updated successfully!');
      },
      (error) => {
        console.error(error);
        if (error.status === 404) {
          alert('User not found. Please check the email address.');
        } else {
          alert('Failed to update user and address information.');
        }
      }
    );
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      alert('Please fix the errors in the form before submitting.');
      return;
    }

    const model = this.passwordForm.value;
    this.userService.changePassword(model).subscribe(
      (response) => {
        alert('Password changed successfully.');
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  private handleError(error: any): void {
    console.error(error);
    if (error.status === 400) {
      alert(error.error || 'Invalid input. Please check your data and try again.');
    } else if (error.status === 500) {
      alert('System error. Please try again later.');
    } else {
      alert('An unexpected error occurred. Please try again.');
    }
  }

}
