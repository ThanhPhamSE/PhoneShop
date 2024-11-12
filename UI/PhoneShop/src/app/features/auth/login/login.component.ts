import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from './models/login-request.model';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from './models/user.model';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model: LoginRequest;
  
constructor(private authService: AuthService,
  private cookieService: CookieService,
  private router: Router
){
  this.model = {
    email: '',
    password: ''
  }
}

  onFormSubmit(): void{
    this.authService.login(this.model)
    .subscribe({
      next: (response) => {
        //Set AuthCookie
        this.cookieService.set('Authorization', `Bearer ${response.token}`,
          undefined,'/',undefined,true,'Strict'
        );

        //Set User
        this.authService.setUser({
          email: response.email,
          roles: response.roles
        })

        //Redirect home page
        this.router.navigateByUrl('/');
      }
    })
  }
}
