import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from '../../pages/auth/login/login.service';
import { ToastService } from '../../components/toast/toast.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private authService: LoginService,
    private router: Router,
    private toast: ToastService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    const clone = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(clone).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.error.message) {
          this.toast.open(error.error.message, 'error');
        } else {
          this.toast.open('Lỗi máy chủ', 'error');
        }
        // if (this.router.url !== '/login' && this.router.url !== '/noti') {
        //   this.authService.logout();
        // }
        return throwError(error.error);
      })
    );
  }
}
