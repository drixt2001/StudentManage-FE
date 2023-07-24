import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  DoCheck,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import { Observable, of } from 'rxjs';
import { face } from '../../modules/face-api/face-api';
import * as dayjs from 'dayjs';
import { host } from '../../config/host';
import { ToastService } from 'src/app/components/toast/toast.service';
import { PeriodService } from '../manager/period/period.service';
import { ModuleService } from '../manager/module/module.service';
import { FaceRecognitionService } from './face-recognition.service';
@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.scss'],
})
export class FaceRecognitionComponent
  implements OnInit, AfterViewInit, DoCheck, OnDestroy
{
  srcObject?: MediaStream;
  enableCamera = false;
  readyEnableCamera = false;

  initFaceAPI = false;
  canvasInterval: any;

  video: HTMLVideoElement | undefined;
  faceMatcher!: any;
  isLoading = true;
  faceDescriptors: any[] = [];
  listUpdate: any[] = [];
  hasJoinList: any[] = [];

  timeRepeatCheck = 1;
  timenow: string = dayjs(Date.now()).format('HH:mm:ss DD/MM/YYYY');
  timeInterval = setInterval(() => {
    this.timenow = dayjs(Date.now()).format('HH:mm:ss DD/MM/YYYY');
  }, 1000);

  currentPeriod?: any;
  moduleData: any[] = [];

  selectedModule?: number;

  constructor(
    private httpClient: HttpClient,
    private toast: ToastService,
    private periodService: PeriodService,
    private moduleService: ModuleService,
    private faceRecognitionService: FaceRecognitionService
  ) {}

  ngOnDestroy(): void {
    this.stopCam();
    document.getElementById('canvas')?.remove();
    clearInterval(this.canvasInterval);
    clearInterval(this.timeInterval);
    this.video = undefined;
  }

  getDatakey(module_id: number, key: string): string {
    return this.moduleData.filter((val) => (val.id = module_id))[0][key];
  }

  ngOnInit(): void {
    this.getCurrentPeriod();
    this.getListModule();
  }

  getCurrentPeriod() {
    this.periodService.getActiveNow().subscribe((res) => {
      if (res.data.length) {
        this.currentPeriod = res.data[0];
      }
    });
  }

  getListModule() {
    this.moduleService.getList().subscribe((res) => {
      this.moduleData = res.data;
    });
  }

  ngAfterViewInit(): void {}

  ngDoCheck(): void {
    this.getFaceAPI().subscribe((hasInit) => {
      if (hasInit && !this.initFaceAPI) {
        this.readyEnableCamera = true;
        this.initFaceAPI = true;
      }
    });
  }

  getFaceAPI(): Observable<boolean> {
    return of(
      face.nets.faceLandmark68Net.isLoaded &&
        face.nets.faceExpressionNet.isLoaded &&
        face.nets.faceRecognitionNet.isLoaded &&
        face.nets.tinyFaceDetector.isLoaded &&
        face.nets.ssdMobilenetv1.isLoaded
    );
  }

  async getCamera(): Promise<void> {
    if (await navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
          this.enableCamera = true;
          this.srcObject = stream;
        });
    }
  }

  toggleCam() {
    if (this.enableCamera) {
      this.stopCam();
      document.getElementById('canvas')?.remove();
      clearInterval(this.canvasInterval);
      this.video = undefined;
    } else {
      // load model first
      this.httpClient
        .get<any[]>(`${host}/personal/model/${this.selectedModule}`)
        .subscribe((faceDescriptors) => {
          if (faceDescriptors.length) {
            this.faceDescriptors = this.convertData(faceDescriptors);
            this.faceMatcher = new faceapi.FaceMatcher(
              this.faceDescriptors,
              0.6
            );
            if (this.faceMatcher) {
              // open camera
              this.getCamera().finally(async () => {
                if (this.enableCamera) {
                  const setCamera = setInterval(() => {
                    if (!this.video) {
                      this.video = document.getElementById(
                        'video'
                      ) as HTMLVideoElement;

                      this.createCanvas();
                      this.faceRecognitionService.addRollCallingClass();
                      clearInterval(setCamera);
                    }
                  }, 25);
                }
              });
            }
          } else {
            this.toast.open('Không có dữ liệu nhận dạng khuôn mặt', 'error');
          }
        });
    }
  }

  async stopCam() {
    this.faceRecognitionService.removeRollCallingClass();
    await this.srcObject?.getTracks().forEach(function (track) {
      if (track.readyState == 'live' && track.kind === 'video') {
        track.stop();
      }
    });
    this.enableCamera = false;
  }

  createCanvas() {
    this.video?.addEventListener('playing', () => {
      if (this.video) {
        const canvas = faceapi.createCanvas(this.video!);
        canvas.id = 'canvas';
        document.querySelector('#video-container')?.append(canvas);

        const size = {
          width: this.video!.offsetWidth,
          height: this.video!.offsetHeight,
        };

        this.canvasInterval = setInterval(async () => {
          const detecs = await faceapi
            .detectAllFaces(this.video!, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withFaceDescriptors();

          const resize = faceapi.resizeResults(detecs, size);

          canvas.height = this.video?.offsetHeight || 0;
          canvas.width = this.video?.offsetWidth || 0;

          canvas.getContext('2d')?.clearRect(0, 0, size.width, size.height);
          // faceapi.draw.drawDetections(canvas, resize);
          // faceapi.draw.drawFaceLandmarks(canvas, resize);
          faceapi.draw.drawFaceExpressions(canvas, resize);

          for (const detection of resize) {
            const label = this.faceMatcher
              .findBestMatch(detection.descriptor)
              .toString();

            if (
              label.substring(0, 7) !== 'unknown' &&
              !this.listUpdate
                .map((val) => val.id)
                .includes(label.substring(0, 10))
            ) {
              this.listUpdate.push({
                id: label.substring(0, 10),
                date: dayjs(new Date()).format('HH:mm:ss DD/MM/YYYY'),
                originDate: Date.now(),
              });
              this.hasJoinList.push(label.substring(0, 10));
            }

            if (
              label.substring(0, 7) !== 'unknown' &&
              this.hasJoinList.includes(label.substring(0, 10))
            ) {
              const index = [...this.listUpdate]
                .reverse()
                .find((val) => (val.id = label.substring(0, 10)));

              if (
                Date.now() - index.originDate >
                this.timeRepeatCheck * 60 * 1000
              ) {
                this.listUpdate.push({
                  id: label.substring(0, 10),
                  date: dayjs(new Date()).format('HH:mm:ss DD/MM/YYYY'),
                  originDate: Date.now(),
                  notFirst: true,
                });
              }
            }

            const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
              label: label,
            });
            drawBox.draw(canvas);
          }
        }, 500);
      }
    });
  }

  convertData(faceDescriptors: any) {
    const faceDescriptorsArray = [];
    for (let i = 0; i < faceDescriptors.length; i++) {
      for (let j = 0; j < faceDescriptors[i].descriptors.length; j++) {
        faceDescriptors[i].descriptors[j] = new Float32Array(
          Object.values(faceDescriptors[i].descriptors[j])
        );
      }

      faceDescriptorsArray.push(
        new face.LabeledFaceDescriptors(
          faceDescriptors[i].label,
          faceDescriptors[i].descriptors
        )
      );
    }
    return faceDescriptorsArray;
  }
}
