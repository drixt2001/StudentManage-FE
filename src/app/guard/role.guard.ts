import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivationStart,
  CanActivate,
  CanActivateChild,
  CanActivateChildFn,
  ChildActivationStart,
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationEnd,
  ResolveStart,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { catchError, filter, map, mergeMap, Observable, of } from 'rxjs';
import { LoginService } from 'src/app/pages/auth/login/login.service';
import { check } from '../modules/face-api/face-api';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private service: LoginService,
    private appService: AppService
  ) {}
  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {
      if (check.guard_id) {
        if (
          check.guard_id === '/' + state.url.split('/')[1] ||
          state.url === '/diemdanh'
        ) {
          if (check.guard_id === '/quanly' && this.appService.percent !== 100) {
            this.appService.getFaceAPIModel();
          }
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      } else {
        return this.service.authInfo().pipe(
          map((response) => {
            if (response.link === '/' + state.url.split('/')[1]) {
              return true;
            } else {
              this.router.navigate(['/login']);
              return false;
            }
          })
        );
      }
    } else {
      // not token in localStorage
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class ChildRoleGuard implements CanActivateChild {
  constructor(private router: Router, private service: LoginService) {}
  canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {
      if (check.guard_id) {
        if (check.guard_id === '/' + state.url.split('/')[1]) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      } else {
        return this.service.authInfo().pipe(
          map((response) => {
            if (response.link === '/' + state.url.split('/')[1]) {
              return true;
            } else {
              this.router.navigate(['/login']);
              return false;
            }
          })
        );
      }
    } else {
      // not token in localStorage
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
