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
}
