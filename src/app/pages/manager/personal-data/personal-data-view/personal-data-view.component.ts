import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PersonalDataViewService } from './personal-data-view.service';

import { LoadingService } from '../../../../interceptor/loading/loading.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { face } from '../../../../modules/face-api/face-api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personal-data-view',
  templateUrl: './personal-data-view.component.html',
  styleUrls: ['./personal-data-view.component.scss'],
})
export class PersonalDataViewComponent implements OnInit {
  selectedTab: string = 'profile';
  selectedRoleStudent = false;
  isLoadingTrainModel = false;
  dataModel: any;
  maxNumber!: number;
  isEdit = false;
  personId!: string;
  uploadPicLink?: string;

  personalForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    birthday: new FormControl(''),
    deparment: new FormControl(''),
    class: new FormControl(''),
    role: new FormControl(''),
    countPictures: new FormControl(0),
  });

  constructor(
    private service: PersonalDataViewService,
    public loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.personId = params.get('Id')!;
    });
    if (this.personId) {
      this.isEdit = true;
      this.getListPicture();
      this.uploadPicLink = `http://localhost:8000/personal/upload/${this.personId}`;
    }
  }

  createPerson() {
    if (this.isEdit) {
    } else {
      this.service
        .createTeacher({
          isTeacher: !this.selectedRoleStudent,
          ...this.personalForm.value,
        })
        .pipe(
          catchError((e) => {
            alert(e.error.message);
            return of();
          })
        )
        .subscribe((val) => {
          alert(val.message);
          this.router.navigate([
            '/admin/canhan/sua/',
            this.personalForm.get('id')?.value,
          ]);
        });
    }
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
      return this.service
        .removePicture(this.personId, file.response.name)
        .pipe();
    } else {
      return this.service.removePicture(this.personId, file.name).pipe();
    }
  };

  handleReq = (file: any) => {
    if (file.type === 'success' && file.file.response.name) {
      this.maxNumber++;
    }
  };
  async updateDataModel() {
    this.dataModel = await this.trainingModel(this.personId);
  }

  getListPicture() {
    this.service.getPicture(this.personId).subscribe((val) => {
      this.fileList = val.data;
      this.maxNumber = val.maxNumber;
    });
  }

  uploadDataModel() {
    this.service.updateModel(this.dataModel, this.personId).subscribe((val) => {
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