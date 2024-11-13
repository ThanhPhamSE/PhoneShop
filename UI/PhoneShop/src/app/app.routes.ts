import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "products",
        component: NavbarComponent
    },
    {
        path: "",
        component: NavbarComponent
    }
];
