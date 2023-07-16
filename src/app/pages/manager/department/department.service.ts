import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from 'src/app/config/host';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  getList() {
    let Url = `${host}/department/all`;
    return this.http.get<any>(Url).pipe();
  }

  getListClass(id: string) {
    let Url = `${host}/class?department_id=${id}`;
    return this.http.get<any>(Url).pipe();
  }
}
