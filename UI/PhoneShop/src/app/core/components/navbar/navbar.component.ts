import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { User } from '../../../features/auth/login/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  user?: User;

  constructor(private authService: AuthService,
    private router : Router
  ){

  }

  ngOnInit(): void {
    this.authService.user()
    .subscribe({
      next: (response) =>{
        this.user = response;
      }
    });

    this.user = this.authService.getUser();
  }

  onLogout(): void{
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
