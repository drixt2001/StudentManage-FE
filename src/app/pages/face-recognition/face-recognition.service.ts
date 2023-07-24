import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class FaceRecognitionService {
  constructor(private socket: Socket) {}

  addRollCallingClass() {
    this.socket.emit('addRollCallingClass', Date.now().toString());
  }

  removeRollCallingClass() {
    this.socket.emit('removeRollCallingClass', Date.now().toString());
  }

  sendGet() {
    this.socket.emit('sendGet', Date.now().toString());
  }

  activeUsers$ = this.socket.fromEvent<any>('get');
}
