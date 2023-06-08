import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private message: NzMessageService) {}

  open(ms: string, type: string) {
    this.message.create(type, ms);
  }
}
