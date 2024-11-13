import { Injectable } from '@angular/core';
import { LoginRequest } from '../login/models/login-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../login/models/login-response.model';
import { HttpClient } from '@angular/common/http';
import { User } from '../login/models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { RegisterRequest } from '../register/models/register-request.model';
import { RegisterResponse } from '../register/models/register-response.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private http: HttpClient,
    private cookieService: CookieService
  ) { }

  login(request: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`https://localhost:7026/api/Auth/login`,{
      email: request.email,
      password: request.password
    });
  }

  setUser(user: User): void{
    this.$user.next(user);
    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));
  }

  user(): Observable<User | undefined>{
    return this.$user.asObservable();
  }

  getUser(): User | undefined{
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');

    if(email && roles){
      const user: User = {
        email: email,
        roles: roles.split(',')
      }
      return user;
    }
    return undefined;
  }

  logout(): void{
    localStorage.clear();
    this.cookieService.delete('Authorization','/');
    this.$user.next(undefined);
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`https://localhost:7026/api/Auth/register`, request);
  }

  forgotPassword(email: string): Observable<any> {
    const url = `https://localhost:7026/api/Auth/forgot-password?email=${encodeURIComponent(email)}`;
    return this.http.post<any>(url, {});
  }

  resetPassword(email: string, token: string, password: string, confirmPassword: string) {
    const body = { email, token, password, confirmPassword };
    return this.http.post(`https://localhost:7026/api/Auth/reset-password`, body);
  }
}
