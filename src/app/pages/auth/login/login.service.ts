import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from '../../../components/toast/toast.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { host } from '../../../config/host';

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
        this.router.navigate(['/quanly']);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  auth() {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>(`http://${host}/account/info`, {
        headers: headers,
      })
      .pipe();
  }
}
