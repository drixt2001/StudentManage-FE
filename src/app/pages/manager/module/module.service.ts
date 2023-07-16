import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from 'src/app/config/host';

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  constructor(private http: HttpClient) {}

  getList() {
    return this.http.get<any>(`${host}/module`);
  }

  create(dto: any) {
    return this.http.post<any>(`${host}/module`, { data: dto });
  }
}
