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
import * as fs from 'fs';
import * as path from 'path';
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
  trainingData: any[] = [];
  isLoading = true;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    const modalServer = this.loadModalFromServer();

    this.getFaceAPI().finally(async () => {
      if (modalServer.length) {
        console.log('run');
        this.trainingData = modalServer;
        this.faceMatcher = new faceapi.FaceMatcher(this.trainingData, 0.6);
        this.getCamera();
        this.create();
      } else {
        await this.trainingModal().finally(() => {
          console.log('train');
          this.faceMatcher = new faceapi.FaceMatcher(this.trainingData, 0.6);
          this.getCamera();
          this.create();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.video = document.getElementById('video') as HTMLVideoElement;
  }

  async trainingModal() {
    this.userLabels = ['19K4081028-THANGLD', '19K4081001-NPBANH'];
    const faceDescriptors = [];

    for (const label of this.userLabels) {
      const descriptors: Float32Array[] = [];

      for (let i = 1; i <= 1; i++) {
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
      }

      await faceDescriptors.push(
        new faceapi.LabeledFaceDescriptors(label, descriptors)
      );
    }

    this.trainingData = faceDescriptors;

    return faceDescriptors;
  }

  updateModalToServer() {
    this.httpClient
      .post('http://localhost:8000/api', { data: this.trainingData })
      .subscribe();
  }

  loadModalFromServer() {
    const serverFaceDescriptors: any[] = [];

    this.httpClient
      .get<any[]>('http://localhost:8000/api')
      .subscribe(async (faceDescriptors) => {
        for (let i = 0; i < faceDescriptors.length; i++) {
          for (let j = 0; j < faceDescriptors[i].descriptors.length; j++) {
            faceDescriptors[i].descriptors[j] = new Float32Array(
              Object.values(faceDescriptors[i].descriptors[j])
            );
          }
          serverFaceDescriptors.push(
            new faceapi.LabeledFaceDescriptors(
              faceDescriptors[i].label,
              faceDescriptors[i].descriptors
            )
          );
        }
      });
    return serverFaceDescriptors;
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
