import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PersonalDataViewService {
  constructor(private httpClient: HttpClient) {}

  getPicture(Id: string) {
    return this.httpClient.get<any>(
      'http://localhost:8000/personal/pictures/' + Id
    );
  }

  removePicture(Id: string, fileName: string) {
    return this.httpClient.delete<any>(
      'http://localhost:8000/personal/pictures/' + Id + '/' + fileName
    );
  }

  updateModel(model: any, Id: string) {
    return this.httpClient.post<any>(
      'http://localhost:8000/personal/model/upload/' + Id,
      { model: model }
    );
  }
}
