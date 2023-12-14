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

  getOne(id: string | number) {
    return this.http.get<any>(`${host}/module/${id}`);
  }

  create(dto: any) {
    return this.http.post<any>(`${host}/module`, { data: dto });
  }

  addStudent(dto: any) {
    return this.http.post<any>(`${host}/module/student`, { data: dto });
  }

  deleteStudent(id: any) {
    return this.http.delete<any>(`${host}/module/student/${id}`);
  }

  getWeekdays() {
    return this.http.get<any>(`${host}/module/weekdays`);
  }

  updateSchedule(module_id: string, data: any) {
    return this.http.put<any>(`${host}/module/schedule/${module_id}`, {
      data: data,
    });
  }

  getSchedule(module_id: string) {
    return this.http.get<any>(`${host}/module/schedule/${module_id}`);
  }

  updateAllow(module_id: string, data: any) {
    return this.http.put<any>(`${host}/module/allow/${module_id}`, {
      data: data,
    });
  }

  getListResult(module_id: string) {
    return this.http.get<any>(`${host}/module/list/${module_id}`);
  }

  getListResultStudent(module_id: string) {
    return this.http.get<any>(`${host}/module/list-student/${module_id}`);
  }
}
