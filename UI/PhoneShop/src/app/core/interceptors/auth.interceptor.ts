import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.get('Authorization');
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
