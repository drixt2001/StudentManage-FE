import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class FaceRecognitionService {
  constructor(private socket: Socket) {}

  activeClass = this.socket.fromEvent<any>('get');

  currentRollCall = this.socket.fromEvent<any>('getCurrentRollCall');
  idAddCurrentRollCall = this.socket.fromEvent<any>('addCurrentRollCallDone');
  resultRollCalling = this.socket.fromEvent<any>('getResultRollCalling');

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

  getResult(data: any) {
    this.socket.emit('getResult', data);
  }

  checkCurrentRollCall(input: any) {
    this.socket.emit('checkCurrentRollCall', input);
  }

  addCurrentRollCall(input: any) {
    this.socket.emit('addCurrentRollCall', input);
  }
}
