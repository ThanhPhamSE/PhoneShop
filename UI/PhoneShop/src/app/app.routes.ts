import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './features/guards/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
    },
];
