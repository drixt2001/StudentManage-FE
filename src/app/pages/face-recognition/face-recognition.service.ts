import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class FaceRecognitionService {
  constructor(private socket: Socket) {}

  activeClass = this.socket.fromEvent<any>('get');
  result = this.socket.fromEvent<any>('get');

  addRollCallingClass() {
    this.socket.emit('addRollCallingClass', Date.now().toString());
  }

  removeRollCallingClass() {
    this.socket.emit('removeRollCallingClass', Date.now().toString());
  }

  sendGet() {
    this.socket.emit('sendGet', Date.now().toString());
  }

  sendResult(data: any) {
    this.socket.emit('sendResult', data);
  }
}
