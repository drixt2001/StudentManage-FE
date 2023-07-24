import { Component } from '@angular/core';
import { FaceRecognitionService } from '../../face-recognition/face-recognition.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  onlineClass = 0;

  constructor(private faceRecognitionService: FaceRecognitionService) {}

  ngOnInit(): void {
    this.faceRecognitionService.sendGet();
    this.faceRecognitionService.activeUsers$.subscribe((val) => {
      this.onlineClass = val;
    });
  }
}
