import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ToastService } from 'src/app/components/toast/toast.service';
import { host } from 'src/app/config/host';

@Injectable({
  providedIn: 'root',
})
export class PersonalDataService {
  constructor(
    private http: HttpClient,
    public toast: ToastService,
    public router: Router
  ) {}

  getList(type: string) {
    const Url = `${host}/personal/list?type=${type}`;
    return this.http.get<any>(Url).pipe();
  }
}
