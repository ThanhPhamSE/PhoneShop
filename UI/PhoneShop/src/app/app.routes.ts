import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './features/guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { ProductManageComponent } from './core/components/product-manage/component/product-manage/product-manage.component';
import { CategoryComponent } from './features/category/category.component';
import { HomePageComponent } from './features/nhap-home/component/home-page/home-page.component';
import { CartComponent } from './features/nhap-home/component/cart/cart.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'manager/product',
    component: ProductManageComponent,
  },
  {
    path: 'manager/category',
    component: CategoryComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
];
