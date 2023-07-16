import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from 'src/app/config/host';

@Injectable({
  providedIn: 'root',
})
export class PeriodService {
  constructor(private http: HttpClient) {}

  getList() {
    return this.http.get<any>(`${host}/period`);
  }

  getActiveNow() {
    return this.http.get<any>(`${host}/period/now`);
  }

  create(dto: any) {
    return this.http.post<any>(`${host}/period`, dto);
  }

  update(id: number, dto: any) {
    return this.http.put<any>(`${host}/period/` + id, dto);
  }

  delete(id: number) {
    return this.http.delete<any>(`${host}/period/` + id);
  }
}
