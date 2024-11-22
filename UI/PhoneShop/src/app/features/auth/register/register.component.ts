import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData = {
    email: '',
    userName: '',
    password: '',
    rePassword: ''
  };

  passwordMismatch = false;

  constructor(private authService: AuthService) { }

  onRegisterSubmit() {
    // Kiểm tra mật khẩu khớp
    this.passwordMismatch = this.registerData.password !== this.registerData.rePassword;
    if (this.passwordMismatch) {
      alert('Passwords do not match! Please try again.');
      return;
    }

    // Gọi API nếu không có lỗi
    this.authService.register({
      email: this.registerData.email,
      userName: this.registerData.userName,
      password: this.registerData.password
    }).subscribe({
      next: (response) => {
        // Thông báo đăng ký thành công và nhắc người dùng xác nhận email
        alert('Registration successful! Please check your email to confirm your account.');
        this.resetForm();
      },
      error: (err) => {
        // Thông báo lỗi đăng ký không thành công
        console.error(err);
        alert('Registration failed. Please try again or contact support.');
      }
    });
  }


  resetForm() {
    this.registerData = {
      email: '',
      userName: '',
      password: '',
      rePassword: ''
    };
    this.passwordMismatch = false;
  }
}
