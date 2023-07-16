import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { PersonalDataViewService } from './personal-data-view.service';

import { LoadingService } from '../../../../interceptor/loading/loading.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { face } from '../../../../modules/face-api/face-api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { host } from '../../../../config/host';
import { PersonalDataService } from '../personal-data.service';
import { ToastService } from 'src/app/components/toast/toast.service';
import { DepartmentService } from '../../department/department.service';

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
  passwordVisible!: boolean;
  departmentData: any[] = [];
  classData: any[] = [];

  personalForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    name: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
    department: new FormControl(0, [Validators.required]),
    class: new FormControl(
      0,
      this.selectedRoleStudent ? [Validators.required] : undefined
    ),
    role: new FormControl(
      '',
      !this.selectedRoleStudent ? [Validators.required] : undefined
    ),
    address: new FormControl('', [Validators.required]),
    countPictures: new FormControl(null),
  });

  constructor(
    private service: PersonalDataViewService,
    private personalService: PersonalDataService,
    private departmentService: DepartmentService,
    public loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.getListDepartment();

    this.route.paramMap.subscribe((params) => {
      this.personId = params.get('Id')!;
    });
    if (this.personId) {
      this.isEdit = true;
      this.selectedRoleStudent = this.personId.charAt(2) === 'K' ? true : false;
      this.getListPicture();
      this.getDetailData();
      this.uploadPicLink = `${host}/personal/upload/${this.personId}`;
    }
  }

  getListDepartment() {
    this.departmentService.getList().subscribe((dep) => {
      this.departmentData = dep.data;
    });
  }

  getListClass(id?: string) {
    id &&
      this.departmentService.getListClass(id).subscribe((cls) => {
        this.classData = cls.data;
      });
  }

  changeDepartment() {
    this.personalForm.value.department &&
      this.getListClass(this.personalForm.value.department.toString());
    this.personalForm.controls.class.reset();
  }

  createPerson() {
    if (this.isEdit) {
    } else {
      const type = this.selectedRoleStudent ? 'student' : 'teacher';
      this.service
        .create(type, {
          ...this.personalForm.value,
        })
        .pipe(
          catchError((e) => {
            this.toast.open(e.error.message, 'error');
            return of();
          })
        )
        .subscribe((val) => {
          this.toast.open(val.message, 'success');
          this.router.navigate([
            '/quanly/canhan/sua/',
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

  getDetailData() {
    const type = this.selectedRoleStudent ? 'student' : 'teacher';
    this.personalService.getDetail(type, this.personId).subscribe((val) => {
      const data = { ...val.data, countPictures: this.maxNumber };
      this.personalForm.patchValue(data);
      this.personalForm.value.department &&
        this.getListClass(this.personalForm.value.department.toString());
    });
  }
  uploadDataModel() {
    this.service.updateModel(this.dataModel, this.personId).subscribe((val) => {
      this.toast.open(val.message, 'success');
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
          `${host}/assets/Pictures/${label}/${fileName}`
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
