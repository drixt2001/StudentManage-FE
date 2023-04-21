import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import { catchError, map } from 'rxjs';

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.scss'],
})
export class FaceRecognitionComponent implements OnInit, AfterViewInit {
  srcObject!: MediaStream;
  enableCamera = false;
  hasPlaying = false;
  created = false;
  video!: HTMLVideoElement;
  faceMatcher!: any;
  userLabels: string[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.userLabels = ['19K4081028-THANGLD', '19K4081001-NPBANH'];
    this.getFaceAPI().finally(async () => {
      const trainingData = await this.trainingModal();
      this.faceMatcher = new faceapi.FaceMatcher(trainingData, 0.6);
      this.getCamera();
      this.create();
    });
  }

  ngAfterViewInit(): void {
    this.video = document.getElementById('video') as HTMLVideoElement;
  }

  async trainingModal() {
    const faceDescriptors: any[] = [];

    for (const label of this.userLabels) {
      const descriptors: Float32Array[] = [];

      for (let i = 1; i <= 2; i++) {
        this.httpClient
          .get(`/assets/usersTraingData/${label}/${i}.jpeg`, {
            observe: 'response',
            responseType: 'blob',
          })
          .pipe(
            map(async (res) => {
              const image = await faceapi.fetchImage(
                `/assets/usersTraingData/${label}/${i}.jpeg`
              );
              const detection = await faceapi
                .detectSingleFace(image)
                .withFaceLandmarks()
                .withFaceDescriptor();
              if (detection) {
                descriptors.push(detection.descriptor);
              }
            })
          )
          .subscribe();
      }

      faceDescriptors.push(
        new faceapi.LabeledFaceDescriptors(label, descriptors)
      );
    }

    return faceDescriptors;
  }

  async getFaceAPI() {
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models');
  }

  async getCamera(): Promise<void> {
    if (await navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
        this.srcObject = stream;
        this.hasPlaying = true;
      });
    }
  }

  create() {
    console.log(this.faceMatcher);
    this.video.addEventListener('playing', () => {
      const canvas = faceapi.createCanvas(this.video);
      canvas.id = 'canvas';
      document.querySelector('#container')?.append(canvas);

      const size = {
        width: this.video.width,
        height: this.video.height,
      };

      setInterval(async () => {
        const detecs = await faceapi
          .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();
        const resize = faceapi.resizeResults(detecs, size);

        canvas.getContext('2d')?.clearRect(0, 0, size.width, size.height);
        // faceapi.draw.drawDetections(canvas, resize);
        // faceapi.draw.drawFaceLandmarks(canvas, resize);
        faceapi.draw.drawFaceExpressions(canvas, resize);

        for (const detection of resize) {
          const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
            label: this.faceMatcher
              .findBestMatch(detection.descriptor)
              .toString(),
          });
          drawBox.draw(canvas);
        }
      }, 100);
    });
  }

  // toggleCamera() {
  //   this.enableCamera = !this.enableCamera;
  //   if (this.enableCamera) {
  //     this.getCamera();
  //   } else {
  //     this.srcObject?.getTracks().forEach(function (track) {
  //       if (track.readyState == 'live' && track.kind === 'video') {
  //         track.stop();
  //       }
  //     });
  //   }
  // }
}
