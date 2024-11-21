import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { map, Observable, Subscription } from 'rxjs';
import { UserService } from './services/user.service';
import { UserManager } from './models/user-manager.model';
import { FormsModule } from '@angular/forms';
import { Role } from '../role/models/role.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  user$: Observable<UserManager[]> = new Observable();
  id : string | null = null;
  paramSubcription? : Subscription;
  role$: Observable<Role[]> = new Observable();
  selectedRole: string = '';
  selectedUser: UserManager | null = null;
  selectedInactivityDays: number = 0;
  totalCount? : number;
  pageNumber = 1;
  pageSize = 5;
  list: number[] = [];

  constructor(private userService : UserService,
              private route : ActivatedRoute
  ){
    
  }
  selectAll: boolean = false;
  selectedUsers: UserManager[] = [];
  selectedUserIds: Set<string> = new Set();
  
  ngOnInit(): void {

    this.role$ = this.userService.getAllRoles();

    this.userService.getUserCount().subscribe({
      next: (value) =>{
        this.totalCount = value;
        this.list = new Array(Math.ceil(value / this.pageSize))
        this.loadUsers();
      }
    })
  }




  toggleStatus(user: UserManager): void {

    const confirmUpdate = window.confirm(`Are you sure you want to change the status of ${user.userName}?`);

    if (confirmUpdate) {

      this.userService.updateUser(user).subscribe({
        next: (response) => {
          window.alert('User status updated successfully!');
          this.loadUsers();
        },
        error: (error) => {
          window.alert('Error updating user status!');
        }
      });
    } else {
      window.alert('Status update canceled');
    }
  }

  loadUsers() {
    this.user$ = this.userService.getAllUsers('', this.selectedInactivityDays, this.pageNumber, this.pageSize);
  }

  // Updated toggleSelect method
toggleSelect(userId: string, event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target) {
    const isChecked = target.checked;
    if (isChecked) {
      this.selectedUserIds.add(userId);
    } else {
      this.selectedUserIds.delete(userId);
    }
  }
}


   toggleSelectAll(isChecked: boolean): void {
    this.user$.subscribe(users => {
      if (isChecked) {
        users.forEach(user => this.selectedUserIds.add(user.id));
      } else {
        this.selectedUserIds.clear();
      }
    });
  }

   updateSelectedUsers(): void {
    if (this.selectedUserIds.size === 0) {
      window.alert('Please select at least one user!');
      return;
    }

    const confirmUpdate = window.confirm('Are you sure you want to update the selected users\' status?');

    if (confirmUpdate) {
      this.user$.subscribe(users => {
        users.forEach(user => {
          if (this.selectedUserIds.has(user.id)) {
            user.isActive = !user.isActive;
            this.userService.updateUser(user).subscribe({
              next: () => {
                console.log(`User ${user.userName} status updated successfully!`);
              },
              error: (error) => {
                console.error(`Error updating user ${user.userName} status`, error);
              }
            });
          }
        });
        window.alert('Selected users status updated!');
        this.loadUsers();
      });
    }
  }

  // Kiểm tra xem user có được chọn không
  isSelected(userId: string): boolean {
    return this.selectedUserIds.has(userId);
  }

  openRolePopup(user: UserManager): void {
     this.selectedUser = user;
     this.selectedRole = user.roles.length > 0 ? user.roles[0].roleId : '';
  }

  closeRolePopup(): void {
    this.selectedUser = null;
    this.selectedRole = '';
  }

  saveRolesForUser(): void {
    if (this.selectedRole && this.selectedUser) {
      this.userService.updateUserRole(this.selectedUser.id, this.selectedRole).subscribe(
        (response) => {
          alert(`Role updated successfully for user ${this.selectedUser?.userName}`);
          this.loadUsers();
          this.closeRolePopup();
        },
        (error) => {
          console.error('Error updating role:', error);
          alert(`Error updating role for user ${this.selectedUser?.userName}`);
        }
      );
    } else {
      alert('Please select a role.');
    }
  }

  exportToExcel(users: UserManager[]): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(users.map(user => ({
      'Id': user.id,
      'Username': user.userName,
      'Email': user.email,
      'Phone Number': user.phoneNumber,
      'Last Login': new Date(user.lastLogin).toLocaleDateString(),
      'Status': user.isActive ? 'Active' : 'Inactive',
      'Roles': user.roles.map(role => role.roleName).join(', ')
    })));

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'User List');

    XLSX.writeFile(wb, 'user_list.xlsx');
  }

  getVisibleUsers(users: UserManager[]): UserManager[] {
    return users.filter(user => user !== null && user !== undefined);
  }

  onSearch(query: string){
    this.user$ = this.userService.getAllUsers(query,0,this.pageNumber, this.pageSize)
  }

  onInactivityDaysChange(): void {
    this.loadUsers();
  }

  getPage(pageNumber: number){
    this.pageNumber = pageNumber;
    this.user$ = this.userService.getAllUsers('', this.selectedInactivityDays, this.pageNumber, this.pageSize);
  }

  getNextPage(){
    if(this.pageNumber + 1 > this.list.length){
      return;
    }
    this.pageNumber += 1;
    this.user$ = this.userService.getAllUsers('', this.selectedInactivityDays, this.pageNumber, this.pageSize);
  }

  getPrePage(){
    if(this.pageNumber - 1 < 1){
      return;
    }
    this.pageNumber -= 1;
    this.user$ = this.userService.getAllUsers('', this.selectedInactivityDays, this.pageNumber, this.pageSize);
  }
}
