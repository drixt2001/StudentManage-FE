import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PersonalDataViewService } from './personal-data-view.service';

import { LoadingService } from '../../../../interceptor/loading/loading.service';
import { map, mergeMap, of } from 'rxjs';
import { face } from '../../../../modules/face-api/face-api';

@Component({
  selector: 'app-personal-data-view',
  templateUrl: './personal-data-view.component.html',
  styleUrls: ['./personal-data-view.component.scss'],
})
export class PersonalDataViewComponent implements OnInit {
  selectedTab: string = 'profile';
  isLoadingTrainModel = false;
  dataModel: any;
  maxNumber!: number;

  constructor(
    private service: PersonalDataViewService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getListPicture();
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
      return this.service.removePicture('19K4081028', file.response.name).pipe(
        mergeMap(() => {
          this.getListPicture();
          return of(true);
        })
      );
    } else {
      return this.service.removePicture('19K4081028', file.name).pipe(
        mergeMap(() => {
          this.getListPicture();
          return of(true);
        })
      );
    }
  };

  handleReq = (file: any) => {
    if (file.type === 'success' && file.file.response.name) {
      this.maxNumber++;
      console.log(file);
      console.log(this.maxNumber);
    }
  };
  async updateDataModel() {
    this.dataModel = await this.trainingModel('19K4081028');
  }

  getListPicture() {
    this.service.getPicture('19K4081028').subscribe((val) => {
      this.fileList = val.data;
      this.maxNumber = val.maxNumber;
    });
  }

  uploadDataModel() {
    this.service.updateModel(this.dataModel, '19K4081028').subscribe((val) => {
      alert(val.message);
      this.dataModel = undefined;
    });
  }

  async trainingModel(label: string) {
    this.isLoadingTrainModel = true;

    let faceDescriptors: any;

    const descriptors: Float32Array[] = [];

    for (let i = 1; i <= this.maxNumber; i++) {
      const fileName =
        this.fileList[i - 1]?.name && !this.fileList[i - 1]?.response
          ? this.fileList[i - 1]?.name
          : this.fileList[i - 1]?.response.name;

      if (fileName) {
        const image = await face.fetchImage(
          `http://localhost:8000/assets/Pictures/${label}/${fileName}`
        );
        const detection = await face
          .detectSingleFace(image)
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection) {
          descriptors.push(detection.descriptor);
        }
      }
    }
    faceDescriptors = new face.LabeledFaceDescriptors(label, descriptors);
    this.isLoadingTrainModel = false;
    return faceDescriptors;
  }
}

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
