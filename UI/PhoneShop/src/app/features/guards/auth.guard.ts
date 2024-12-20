import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../auth/services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  
  const authService = inject(AuthService);

  const router = inject(Router);

  const user = authService.getUser();

  let token = cookieService.get('Authorization');
  
  if(token && user){
    token = token.replace('Bearer ','');
    const decodedToken: any = jwtDecode(token);

    //Check if token has expired
    const expirationDate = decodedToken.exp * 1000;
    const currentTime = new Date().getDate();

    if(expirationDate < currentTime){
      authService.logout();
    return router.createUrlTree(['login'], {queryParams : { returlUrl : state.url }})
    }else{
      //Token is still valid
      if(user.roles.includes('Admin')){
        return true;
      }else{
        alert("Unauthorized");
        return false;
      }
    }
  }else{
    authService.logout();
    return router.createUrlTree(['login'], {queryParams : { returlUrl : state.url }})
  }
  
  return true;
};
