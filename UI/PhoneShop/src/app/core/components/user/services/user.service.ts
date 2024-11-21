import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserManager } from '../models/user-manager.model';
import { Role } from '../../role/models/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://localhost:7026';

  constructor(private http : HttpClient) { }

  // getAllUsers(query? : string, inactivityDays?: number, pageNumber?: number, pageSize?: number): Observable<UserManager[]>{
  //   let params = new HttpParams();
  //   if(query){
  //     params = params.set('query',query)
  //   }
  //   if (inactivityDays) {
  //     params = params.set('inactivityDays', inactivityDays.toString());
  //   }

  //   if (pageNumber) {
  //     params = params.set('pageNumber', pageNumber.toString());
  //   }

  //   if (pageSize) {
  //     params = params.set('pageSize', pageSize.toString());
  //   }

  //   return this.http.get<UserManager[]>(`${this.apiUrl}/api/User`,{
  //     params : params
  //   });
  // }

  getAllUsers(query?: string, inactivityDays?: number, pageNumber: number = 1, pageSize: number = 10): Observable<UserManager[]> {
    let params = new HttpParams();
  
    // Thêm tham số query vào URL nếu có
    if (query) {
      params = params.set('query', query);
    }
  
    // Thêm tham số inactivityDays vào URL nếu có
    if (inactivityDays) {
      params = params.set('inactivityDays', inactivityDays.toString());
    }
  
    // Thêm tham số phân trang vào URL
    params = params.set('pageNumber', pageNumber.toString());
    params = params.set('pageSize', pageSize.toString());
  
    // In ra URL hoàn chỉnh để kiểm tra (chỉ để debug)
    const url = `${this.apiUrl}/api/User?${params.toString()}`;
    console.log(url);  // In ra URL hoàn chỉnh
  
    // Gửi yêu cầu GET đến API với các tham số đã kết hợp
    return this.http.get<UserManager[]>(url);
  }
  
  

  updateUser(user: UserManager): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/User/${user.id}/toggle-status`, user);
  }

  getAllRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(`${this.apiUrl}/api/User/roles`);
  }

  updateUserRole(userId: string, roleId: string): Observable<any> {
    const url = `${this.apiUrl}/api/User/update-role?userId=${userId}&roleId=${roleId}`;
    
    const payload = { userId, roleId };
    
    return this.http.put<any>(url, payload);
  }

  getUserCount(): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/api/User/count`);
  }
   
}
