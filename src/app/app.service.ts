import { Injectable } from '@angular/core';
import { check, face } from './modules/face-api/face-api';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  percent = 0;
  load = {
    faceLandmark68Net: false,
    faceExpressionNet: false,
    faceRecognitionNet: false,
    tinyFaceDetector: false,
    ssdMobilenetv1: false,
  } as any;

  loadList = [
    {
      key: 'faceLandmark68Net',
      loaded: false,
    },
    {
      key: 'faceExpressionNet',
      loaded: false,
    },
    {
      key: 'faceRecognitionNet',
      loaded: false,
    },
    {
      key: 'tinyFaceDetector',
      loaded: false,
    },
    {
      key: 'ssdMobilenetv1',
      loaded: false,
    },
  ];
  constructor() {}

  async getFaceAPIModel() {
    await face.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await face.nets.faceExpressionNet.loadFromUri('/assets/models');
    await face.nets.faceRecognitionNet.loadFromUri('/assets/models');
    await face.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await face.nets.ssdMobilenetv1.loadFromUri('/assets/models');
    check.loadFaceApi = true;
  }

  getFaceAPISuccess(): Observable<number> {
    if (this.percent < 100) {
      if (
        face.nets.faceLandmark68Net.isLoaded &&
        this.load['faceLandmark68Net'] === false
      ) {
        this.percent += 20;
        this.load['faceLandmark68Net'] = true;
      }

      if (
        face.nets.faceExpressionNet.isLoaded &&
        this.load['faceExpressionNet'] === false
      ) {
        this.percent += 20;
        this.load['faceExpressionNet'] = true;
      }
      if (
        face.nets.faceRecognitionNet.isLoaded &&
        this.load['faceRecognitionNet'] === false
      ) {
        this.percent += 20;
        this.load['faceRecognitionNet'] = true;
      }
      if (
        face.nets.tinyFaceDetector.isLoaded &&
        this.load['tinyFaceDetector'] === false
      ) {
        this.percent += 20;
        this.load['tinyFaceDetector'] = true;
      }
      if (
        face.nets.ssdMobilenetv1.isLoaded &&
        this.load['ssdMobilenetv1'] === false
      ) {
        this.percent += 20;
        this.load['ssdMobilenetv1'] = true;
      }
    }

    return of(this.percent);
  }
}
