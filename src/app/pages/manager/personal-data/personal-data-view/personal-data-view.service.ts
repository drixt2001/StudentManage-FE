import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { host } from '../../../../config/host';

@Injectable({
  providedIn: 'root',
})
export class PersonalDataViewService {
  constructor(private httpClient: HttpClient) {}

  getPicture(Id: string) {
    return this.httpClient.get<any>(`${host}/personal/pictures/` + Id);
  }

  removePicture(Id: string, fileName: string) {
    return this.httpClient.delete<any>(
      `${host}/personal/pictures/` + Id + '/' + fileName
    );
  }

  updateModel(model: any, Id: string) {
    return this.httpClient.post<any>(`${host}/personal/model/upload/` + Id, {
      model: model,
    });
  }

  create(type: string, data: any) {
    return this.httpClient.post<any>(`${host}/personal/create`, {
      type: type,
      data: data,
    });
  }

  uploadPicture(urlHost: string, formData: any) {
    return this.httpClient.post<any>(urlHost, formData);
  }
}
