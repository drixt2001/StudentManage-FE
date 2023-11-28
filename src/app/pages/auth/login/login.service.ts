import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../../../components/toast/toast.service';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';
import { host } from '../../../config/host';
import { check } from 'src/app/modules/face-api/face-api';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    public toast: ToastService,
    public router: Router
  ) {}

  login(email: string, password: string) {
    const Url = `${host}/auth/login`;
    return this.http.post<any>(Url, { email, password }).pipe(
      map((res) => {
        localStorage.setItem('token', res.access_token);
        this.router.navigate([res.router_link]);
        return of(true);
      })
    );
  }

  async logout() {
    check.guard_id = await '';
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  authInfo() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>(`${host}/auth/info`, {
        headers: headers,
      })
      .pipe(
        map((val) => {
          if (val.link) {
            check.guard_id = val.link;
            this.router.navigate([val.link]);
            return val;
          }
        })
      );
  }
}
