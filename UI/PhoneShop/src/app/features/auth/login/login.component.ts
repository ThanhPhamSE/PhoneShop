import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from './models/login-request.model';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { User } from './models/user.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model: LoginRequest;

  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.model = {
      email: '',
      password: ''
    }
  }

  onFormSubmit(): void {
    this.authService.login(this.model)
      .subscribe({
        next: (response) => {
          //Set AuthCookie
          this.cookieService.set('Authorization', `Bearer ${response.token}`,
            undefined, '/', undefined, true, 'Strict'
          );

          //Set User
          this.authService.setUser({
            email: response.email,
            roles: response.roles
          })

          //Redirect home page
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          // Xử lý lỗi và hiển thị thông báo lỗi
          if (err.status === 403) {
            alert(err.error || 'Email not confirmed. Please check your email.');
          } else {
            alert('Login failed. Please check your credentials and try again.');
          }
          console.error('Login error:', err);
        }
      })
  }


  forgotPasswordModel = { email: '' };
  //forgot password
  onForgotPasswordSubmit() {
    this.authService.forgotPassword(this.forgotPasswordModel.email).subscribe(
      (response) => {
        alert(response.message); // Display success message
      },
      (error) => {
        alert('Failed to send reset link. Please try again.');
        console.error('Forgot password error:', error);
      }
    );
  }


}
