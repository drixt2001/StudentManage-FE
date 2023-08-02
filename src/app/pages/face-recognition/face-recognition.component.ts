import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  DoCheck,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import { Observable, Subscription, of, take, takeUntil } from 'rxjs';
import { face } from '../../modules/face-api/face-api';
import * as dayjs from 'dayjs';
import { host } from '../../config/host';
import { ToastService } from 'src/app/components/toast/toast.service';
import { PeriodService } from '../manager/period/period.service';
import { ModuleService } from '../manager/module/module.service';
import { FaceRecognitionService } from './face-recognition.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import * as isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.component.html',
  styleUrls: ['./face-recognition.component.scss'],
})
export class FaceRecognitionComponent
  implements OnInit, AfterViewInit, DoCheck, OnDestroy
{
  listCamera: any[] = [];
  selectedCamera: any;
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

  timeRepeatCheck = 0;
  countCheck = 0;
  currentProgress = 0;
  initProgressTime = 0;

  timenow: string = dayjs(Date.now()).format('HH:mm:ss DD/MM/YYYY');
  timeInterval = setInterval(() => {
    this.timenow = dayjs(Date.now()).format('HH:mm:ss DD/MM/YYYY');
  }, 1000);

  currentPeriod?: any;
  moduleData: any[] = [];

  faceForm = new FormGroup({
    selectedModule: new FormControl(''),
  });

  schedule: any;

  listStudent: any[] = [];

  initRollCallId: number | undefined;

  sub: Subscription = new Subscription();
  sendData: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private toast: ToastService,
    private periodService: PeriodService,
    private moduleService: ModuleService,
    private faceRecognitionService: FaceRecognitionService,
    private nzMessageService: NzMessageService
  ) {}

  ngOnDestroy(): void {
    if (this.enableCamera) {
      this.faceRecognitionService.removeRollCallingClass();
    }
    this.stopCam();
    document.getElementById('canvas')?.remove();
    clearInterval(this.canvasInterval);
    clearInterval(this.timeInterval);
    this.video = undefined;
    this.sub.unsubscribe();
  }

  getDatakey(module_id: any, key: string): any {
    return this.moduleData.filter((val) => val.id == module_id)[0][key];
  }

  isBetween() {
    const currentTime = dayjs().format('HH:mm:ss');

    return (
      this.schedule &&
      currentTime >= this.schedule.start_on_day &&
      currentTime <= this.schedule.end_on_day
    );
  }

  ngOnInit(): void {
    this.getCameraSelection();
    this.getCurrentPeriod();
    this.getListModule();

    this.fetchRollCallData();
  }

  changeModule() {
    this.schedule = undefined;
    const id = this.faceForm.controls.selectedModule.value;

    this.timeRepeatCheck =
      id &&
      this.getDatakey(
        this.faceForm.controls.selectedModule.value,
        'time_repeat_check'
      );

    id &&
      this.sub.add(
        this.moduleService.getSchedule(id).subscribe((wd) => {
          if (wd.data) {
            wd.data.map((day: any) => {
              if (day.weekday_id === dayjs().day()) {
                this.schedule = day;
                this.changeReatTime();
                this.faceRecognitionService.checkCurrentRollCall({
                  module_id: id,
                  weekday_id: day.weekday_id,
                  date: dayjs().format('YYYY-MM-DD'),
                });
              }
            });
          }
        })
      );

    id &&
      this.sub.add(
        this.moduleService.getOne(id).subscribe((module) => {
          if (module.data.students) this.listStudent = module.data.students;
        })
      );

    this.sub.add(
      this.faceRecognitionService.currentRollCall
        .pipe(take(1))
        .subscribe(async (initData) => {
          if (!initData) {
            this.faceRecognitionService.addCurrentRollCall({
              module_id: id,
              weekday_id: dayjs().day(),
              date: dayjs().format('YYYY-MM-DD'),
            });
            this.faceRecognitionService.idAddCurrentRollCall
              .pipe(take(1))
              .subscribe(async (val) => {
                this.initRollCallId = val;
                await this.updateData();
              });
          } else {
            this.initRollCallId = initData.id;
            this.getData();
          }
        })
    );
  }

  getData() {
    this.faceRecognitionService.getResult({
      id: this.initRollCallId,
    });
  }
  async updateData() {
    this.sendData = this.listStudent.map((st) => {
      return {
        ...st,
        minuteJoin: this.summary(st.id)[3],
        percentJoin: this.summary(st.id)[0],
        isDelay: this.summary(st.id)[1],
        isLeave: this.summary(st.id)[2],
      };
    });

    this.initRollCallId &&
      (await this.faceRecognitionService.sendResult({
        rollCallId: this.initRollCallId,
        moduleId: this.faceForm.value.selectedModule,
        data: [...this.sendData],
      }));

    console.log('upadte call', this.sendData);
  }

  fetchRollCallData() {
    this.sub.add(
      this.faceRecognitionService.resultRollCalling
        .pipe()
        .subscribe(async (rs: any[]) => {
          if (rs) {
            const newList = await this.listStudent.map((st) => {
              const mapSt = rs.find(
                (rsSt) => rsSt.student_id === st.student_id
              );

              return {
                ...st,
                minuteJoin: mapSt?.minute_join,
                percentJoin: mapSt?.total_percent,
                isDelay: mapSt?.delay,
                isLeave: mapSt?.leave,
              };
            });

            this.listStudent = newList;
            console.log('new list update', this.listStudent);
          }
        })
    );
  }

  changeReatTime() {
    if (this.schedule) {
      const totalHour =
        this.getHourOrMinute(0, this.schedule.end_on_day) -
        this.getHourOrMinute(0, this.schedule.start_on_day);
      const totalMinute =
        this.getHourOrMinute(1, this.schedule.end_on_day) -
        this.getHourOrMinute(1, this.schedule.start_on_day);

      const totalTimeCheck = totalHour * 60 + totalMinute;

      this.countCheck =
        totalTimeCheck >= 0 ? totalTimeCheck / this.timeRepeatCheck : 0;
    }
  }

  getProgressCheck() {
    if (this.schedule) {
      const date = new Date();
      const cHour =
        date.getHours() - this.getHourOrMinute(0, this.schedule.start_on_day);
      const cMinute =
        date.getMinutes() - this.getHourOrMinute(1, this.schedule.start_on_day);
      const cSecond =
        date.getSeconds() - this.getHourOrMinute(2, this.schedule.start_on_day);

      const cTotal = cHour * 60 * 60 + cMinute * 60 + cSecond;

      if (
        dayjs(date)
          .set('minute', dayjs(date).minute() - 1)
          .format('HH:mm:ss') < this.schedule.end_on_day
      ) {
        const progressTime =
          Math.floor(cTotal / (this.timeRepeatCheck * 60)) + 1;

        if (this.initProgressTime < progressTime) {
          this.updateData();

          this.initProgressTime = progressTime;
        }

        return progressTime;
      } else {
        return 0;
      }
    }
    return 0;
  }

  summary(studentSid: string) {
    let percent = 0;
    let minuteJoin = 0;
    let delay = false;
    let leave = true;

    const lastItem = [...this.listUpdate]
      .reverse()
      .find((el) => el.id === studentSid);

    const previousValue = [...this.listStudent].find(
      (st) => st.id === studentSid
    );

    if (!lastItem) {
      percent = previousValue.percentJoin ?? 0;
      minuteJoin = previousValue.minuteJoin ?? 0;
      delay = previousValue.isDelay ?? false;
      leave = previousValue.isLeave ?? true;
    } else {
      if (lastItem?.totalTimeJoin) {
        percent =
          (lastItem.totalTimeJoin / (this.countCheck * this.timeRepeatCheck)) *
          100;
        minuteJoin = lastItem.totalTimeJoin;
      }
      if (lastItem?.isDelayDay) {
        delay = true;
      }
    }

    const minPercent = this.getDatakey(
      this.faceForm.controls.selectedModule.value,
      'allow_min_percent'
    );

    if (percent >= minPercent) leave = false;
    if (percent > 100) percent = 100;
    return [percent.toFixed(1), delay, leave, minuteJoin];
  }

  getHourOrMinute(option: number, time: string) {
    // 0 hour 1 minute
    return Number(time.split(':')[option]);
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
    const constraints = {
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440,
        },
        deviceId: this.selectedCamera,
      },
    };

    if (await navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        this.enableCamera = true;
        this.srcObject = stream;
      });
    }
  }

  changeCamera() {
    if (this.enableCamera) {
      this.getCamera();
    }
  }

  getCameraSelection = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      this.listCamera = videoDevices;
      this.listCamera[0]?.deviceId
        ? (this.selectedCamera = this.listCamera[0].deviceId)
        : null;
    });
  };

  toggleCam() {
    if (this.enableCamera) {
      this.faceRecognitionService.removeRollCallingClass();
      this.stopCam();
      document.getElementById('canvas')?.remove();
      clearInterval(this.canvasInterval);
      this.video = undefined;
    } else {
      // load model first
      this.httpClient
        .get<any[]>(
          `${host}/personal/model/${this.faceForm.value.selectedModule}`
        )
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
    await this.srcObject?.getTracks().forEach(function (track) {
      if (track.readyState == 'live' && track.kind === 'video') {
        track.stop();
      }
    });

    this.enableCamera = false;
  }

  createCanvas() {
    this.faceRecognitionService.addRollCallingClass();
    const delayMax = this.getDatakey(
      this.faceForm.controls.selectedModule.value,
      'allow_delay'
    );

    if (this.video) {
      const canvas = faceapi.createCanvas(this.video!);
      canvas.id = 'canvas';
      document.querySelector('#camera-zone')?.append(canvas);

      let camera = document.getElementById('camera-zone');

      this.video!.addEventListener(
        'loadedmetadata',
        (e) => {
          let positionInfo = camera!.getBoundingClientRect();
          const size = {
            width: positionInfo.width,
            height: positionInfo.height,
          };

          this.canvasInterval = setInterval(async () => {
            const detecs = await faceapi
              .detectAllFaces(
                this.video!,
                new faceapi.TinyFaceDetectorOptions()
              )
              .withFaceLandmarks()
              .withFaceExpressions()
              .withFaceDescriptors();

            const resize = faceapi.resizeResults(detecs, size);

            canvas.height = positionInfo.height;
            canvas.width = positionInfo.width;

            canvas.getContext('2d')?.clearRect(0, 0, size.width, size.height);
            // faceapi.draw.drawDetections(canvas, resize);
            // faceapi.draw.drawFaceLandmarks(canvas, resize);
            faceapi.draw.drawFaceExpressions(canvas, resize);

            for (const detection of resize) {
              const label = this.faceMatcher
                .findBestMatch(detection.descriptor)
                .toString();

              const isUnknown = label.substring(0, 7) === 'unknown';
              const id = !isUnknown ? label.substring(0, 10) : undefined;

              const current = new Date();
              const isDelay =
                dayjs(
                  current.setMinutes(current.getMinutes() - Number(delayMax))
                ).format('HH:mm:ss') > this.schedule.start_on_day;

              const firstJoin = !this.hasJoinList.includes(id);
              const previousValue = [...this.listStudent].filter(
                (st) => st.id === id
              )[0];

              // is first join
              if (id && firstJoin) {
                const person = {
                  id: id,
                  date: dayjs(new Date()).format('HH:mm:ss DD/MM/YYYY'),
                  originDate: current,
                  delay: isDelay,
                  isDelayDay: isDelay,
                  countJoin: 1,
                  totalTimeJoin:
                    previousValue.minuteJoin + this.timeRepeatCheck,
                  progressCheck: this.getProgressCheck(),
                };

                this.listUpdate.push(person);
                this.hasJoinList.push(id);
              }

              // not first join
              if (id && !firstJoin) {
                const lastItem = [...this.listUpdate]
                  .reverse()
                  .find((el) => el.id === id);

                if (
                  lastItem &&
                  lastItem.progressCheck < this.getProgressCheck()
                ) {
                  const person = {
                    ...lastItem,
                    delay: undefined,
                    date: dayjs(new Date()).format('HH:mm:ss DD/MM/YYYY'),
                    originDate: current,
                    countJoin: lastItem.countJoin + 1,
                    totalTimeJoin:
                      lastItem.totalTimeJoin + this.timeRepeatCheck,
                    progressCheck: this.getProgressCheck(),
                    notFirst: true,
                  };

                  this.listUpdate.push(person);
                }
              }

              const drawBox = new faceapi.draw.DrawBox(
                detection.detection.box,
                {
                  label: label,
                }
              );
              drawBox.draw(canvas);
            }
          }, 500);
        },
        false
      );
    }
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

  // modal

  isVisibleModal = false;

  handleCancel() {
    this.isVisibleModal = false;
  }

  handleOpen() {
    this.isVisibleModal = true;
  }

  confirmFinish(): void {
    this.toggleCam();
    this.isVisibleModal = true;
    this.faceRecognitionService.sendResult({
      rollCallId: this.initRollCallId,
      moduleId: this.faceForm.value.selectedModule,
      data: [...this.sendData],
    });
  }

  // window
  @HostListener('window:beforeunload')
  onBeforeUnload() {
    if (this.enableCamera) {
      this.faceRecognitionService.removeRollCallingClass();
    }
  }
}
