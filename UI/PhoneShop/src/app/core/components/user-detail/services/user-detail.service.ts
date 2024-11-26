import { HttpClient } from '@angular/common/http';
import { Injectable, model } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment.development';
import { User } from '../models/user';
import { Address } from '../models/address';
import { ChangePassword } from '../models/changePassword';
import { UpdateUserAndAddress } from '../models/updateUserAndAddress';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  // Lấy thông tin User và Address theo email
  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/User/get-by-email?email=${encodeURIComponent(email)}`);
  }

  // Cập nhật thông tin User và Address
  updateUserByEmail(email: string, updateModel: any): Observable<string> {
    return this.http.put<string>(`${environment.apiUrl}/api/User/update-by-email?email=${encodeURIComponent(email)}`, updateModel);
  }

  // Đổi mật khẩu
  changePassword(changePasswordModel: any): Observable<string> {
    return this.http.put<string>(`${environment.apiUrl}/api/User/change-password`, changePasswordModel);
    // return this.http.put(`${environment.apiUrl}/api/User/change-password`, model, { responseType: 'text' });

  }

  getUser(): User | undefined {
    const userId = localStorage.getItem('user-id');
    const userName = localStorage.getItem('user-name');
    const email = localStorage.getItem('user-email');
    const passwordHash = localStorage.getItem('user-password-hash');
    const phoneNumber = localStorage.getItem('user-phone-number');

    if (userId && userName && email && passwordHash && phoneNumber) {
      const user: User = {
        userId: userId,
        userName: userName,
        email: email,
        passwordHash: passwordHash,
        phoneNumber: phoneNumber
      };
      return user;
    }
    return undefined;
  }
  // // Sau khi đăng nhập thành công, lưu thông tin người dùng vào localStorage
  // loginSuccess(user: User): void {
  //   localStorage.setItem('user-id', user.userId);
  //   localStorage.setItem('user-name', user.userName);
  //   localStorage.setItem('user-email', user.email);
  //   localStorage.setItem('user-password-hash', user.passwordHash);
  //   localStorage.setItem('user-phone-number', user.phoneNumber);
  // }

}
