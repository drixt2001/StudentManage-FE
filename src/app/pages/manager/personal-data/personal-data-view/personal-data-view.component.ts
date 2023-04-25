import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PersonalDataViewService } from './personal-data-view.service';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-personal-data-view',
  templateUrl: './personal-data-view.component.html',
  styleUrls: ['./personal-data-view.component.scss'],
})
export class PersonalDataViewComponent implements OnInit {
  selectedTab: string = 'profile';

  constructor(private service: PersonalDataViewService) {}

  ngOnInit(): void {
    this.service.getPicture('19K4081028').subscribe((val) => {
      this.fileList = val;
      this.getFaceAPIModel();
    });
  }

  changeTab(tabName: string) {
    this.selectedTab = tabName;
  }

  //
  previewVisible = false;
  previewImage: string | undefined = '';
  fileList: NzUploadFile[] = [];

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  handleRemove = (file: NzUploadFile) => {
    if (file.response) {
      return this.service.removePicture('19K4081028', file.response.name);
    } else {
      return this.service.removePicture('19K4081028', file.name);
    }
  };

  async updateDataModel() {
    const dataModel = await this.trainingModel('19K4081028');
    this.service.updateModel(dataModel, '19K4081028').subscribe();
  }

  async trainingModel(label: string) {
    let faceDescriptors: any;

    const descriptors: Float32Array[] = [];

    for (let i = 1; i <= this.fileList.length; i++) {
      const image = await faceapi.fetchImage(
        `http://localhost:8000/assets/Pictures/${label}/${i}.jpg`
      );
      const detection = await faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (detection) {
        descriptors.push(detection.descriptor);
      }
    }
    faceDescriptors = new faceapi.LabeledFaceDescriptors(label, descriptors);
    return faceDescriptors;
  }

  async getFaceAPIModel() {
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/models');
  }
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
