import { Component, DoCheck, OnInit } from '@angular/core';
import { check, face } from './modules/face-api/face-api';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck {
  title = 'quanlysinhvien';
  canActive = false;
  percent = 0;
  token: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getFaceAPIModel();
    this.token = localStorage.getItem('token') || '';
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  ngDoCheck(): void {
    this.getFaceAPISuccess().subscribe((isSuccess) => {
      if (isSuccess) {
        this.canActive = true;
        this.percent += 25;
      }
    });
  }

  getFaceAPISuccess(): Observable<boolean> {
    if (face.nets.faceLandmark68Net.isLoaded) this.percent += 15;
    if (face.nets.faceExpressionNet.isLoaded) this.percent += 15;
    if (face.nets.faceRecognitionNet.isLoaded) this.percent += 15;
    if (face.nets.tinyFaceDetector.isLoaded) this.percent += 15;
    if (face.nets.ssdMobilenetv1.isLoaded) this.percent += 15;
    return of(
      face.nets.faceLandmark68Net.isLoaded &&
        face.nets.faceExpressionNet.isLoaded &&
        face.nets.faceRecognitionNet.isLoaded &&
        face.nets.tinyFaceDetector.isLoaded &&
        face.nets.ssdMobilenetv1.isLoaded
    );
  }

  async getFaceAPIModel() {
    await face.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await face.nets.faceExpressionNet.loadFromUri('/assets/models');
    await face.nets.faceRecognitionNet.loadFromUri('/assets/models');
    await face.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await face.nets.ssdMobilenetv1.loadFromUri('/assets/models');
    check.loadFaceApi = true;
  }
}
