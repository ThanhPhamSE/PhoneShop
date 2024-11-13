import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  passwordMismatch: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Lấy token từ URL
    this.token = this.route.snapshot.queryParams['token'];

    console.log(this.token);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { email, password, confirmPassword } = form.value;

      // Kiểm tra mật khẩu khớp
      if (password !== confirmPassword) {
        this.passwordMismatch = true;
        return;
      }

      this.passwordMismatch = false;

      // Gửi yêu cầu reset mật khẩu
      this.authService.resetPassword(email, this.token, password, confirmPassword).subscribe({
        next: (response) => {
          alert('Mật khẩu đã được đặt lại thành công.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          alert('Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
          console.error('Lỗi đặt lại mật khẩu:', error);
        },
      });
      
    }
  }
}
