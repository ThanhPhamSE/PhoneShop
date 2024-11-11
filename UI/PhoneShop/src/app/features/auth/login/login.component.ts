import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from './models/login-request.model';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  model: LoginRequest;
  constructor(
  ){
    this.model ={
      email: '',
      password: ''
    }
  }
  onFormSubmit(): void{
    console.log(this.model);
  }
}
