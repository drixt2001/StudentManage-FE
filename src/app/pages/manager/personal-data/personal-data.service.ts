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

  getList(
    type: string,
    department_id?: string,
    class_id?: string,
    name?: string
  ) {
    let Url = `${host}/personal/list?type=${type}`;
    if (department_id) Url += `&department=${department_id}`;
    if (class_id) Url += `&class_id=${class_id}`;
    if (name) Url += `&name=${name}`;
    return this.http.get<any>(Url).pipe();
  }

  getDetail(type: string, id: any) {
    const Url = `${host}/personal/detail/${id}?type=${type}`;
    return this.http.get<any>(Url).pipe();
  }

  delete(id: string) {
    return this.http.delete<any>(`${host}/personal/` + id);
  }
}
