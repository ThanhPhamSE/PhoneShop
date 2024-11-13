import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ProductManageComponent } from './core/components/product-manage/component/product-manage/product-manage.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin/manage/product',
    component: ProductManageComponent,
  },
];
