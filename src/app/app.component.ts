import { Component, OnInit } from '@angular/core';
import { face } from './modules/face-api/face-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'quanlysinhvien';

  ngOnInit(): void {
    this.getFaceAPIModel();
  }

  async getFaceAPIModel() {
    await face.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await face.nets.faceExpressionNet.loadFromUri('/assets/models');
    await face.nets.faceRecognitionNet.loadFromUri('/assets/models');
    await face.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await face.nets.ssdMobilenetv1.loadFromUri('/assets/models');
  }
}
