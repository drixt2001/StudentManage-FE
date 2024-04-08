import { Component, OnInit } from '@angular/core';
import { PersonalDataService } from '../personal-data.service';
import * as dayjs from 'dayjs';
import { DepartmentService } from '../../department/department.service';
import { map } from 'rxjs';
import { ToastService } from 'src/app/components/toast/toast.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import readXlsxFile from 'read-excel-file';

@Component({
  selector: 'app-personal-data-list',
  templateUrl: './personal-data-list.component.html',
  styleUrls: ['./personal-data-list.component.scss'],
})
export class PersonalDataListComponent implements OnInit {
  constructor(
    private personalDataService: PersonalDataService,
    private departmentService: DepartmentService,

    public toast: ToastService
  ) {}

  selectedRole!: string;
  selectedDepartment?: string;
  selectedClass?: string;
  nameValue!: string;

  departmentData: any[] = [];
  classData: any[] = [];
  personalData: any[] = [];
  listStudent: any[] = [];
  isVisibleModal = false;
  personalData2: any[] = [];
  ngOnInit(): void {
    this.selectedRole = 'teacher';
    this.getData();
    this.getListDepartment();
  }

  search() {
    this.getData();
  }

  convertDate(date: string) {
    return dayjs(date).format('DD/MM/YYYY');
  }

  getData() {
    this.personalDataService
      .getList(
        this.selectedRole,
        this.selectedDepartment,
        this.selectedClass,
        this.nameValue
      )
      .subscribe((res) => {
        this.personalData = res.data;
      });
  }

  setData() {
    this.personalData = [];
    this.getData();
  }

  changeDepartment() {
    this.selectedClass = undefined;
    this.getListClass(this.selectedDepartment);
    this.getData();
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

  delete(id: string) {
    this.personalDataService
      .delete(id)
      .pipe(
        map((res) => {
          this.setData();
          return this.toast.open('Xóa thành công!', 'success');
        })
      )
      .subscribe();
  }

  handleCancel() {
    this.isVisibleModal = false;
  }

  show() {
    this.isVisibleModal = true;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    readXlsxFile(file as any).then((rows) => {
      console.log(rows);
      // `rows` is an array of rows
      // each row being an array of cells.
    });
    return false;
  };
}
