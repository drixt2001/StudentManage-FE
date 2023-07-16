import { Component } from '@angular/core';
import { ModuleService } from './module.service';
import { ToastService } from 'src/app/components/toast/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from '../department/department.service';
import { PeriodService } from '../period/period.service';
import { PersonalDataService } from '../personal-data/personal-data.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
})
export class ModuleComponent {
  listOfData: any[] = [];
  isVisible = false;
  nameValue = '';

  moduleForm = new FormGroup({
    sid: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    period_id: new FormControl(0, [Validators.required]),
    department_id: new FormControl(0, [Validators.required]),
    teacher_id: new FormControl(0, [Validators.required]),
    credit: new FormControl(0, [Validators.required]),
  });

  departmentData: any[] = [];
  periodData: any[] = [];
  teacherData: any[] = [];

  constructor(
    private services: ModuleService,
    public toast: ToastService,
    private departmentService: DepartmentService,
    private periodService: PeriodService,
    private personalDataService: PersonalDataService
  ) {}

  ngOnInit(): void {
    this.getList();
    this.getListDepartment();
    this.getListPeriod();
  }

  getList() {
    this.services.getList().subscribe((res) => {
      this.listOfData = res.data;
    });
  }

  getListDepartment() {
    this.departmentService.getList().subscribe((dep) => {
      this.departmentData = dep.data;
    });
  }

  getListPeriod() {
    this.periodService.getList().subscribe((period) => {
      this.periodData = period.data;
    });
  }

  getTeacherForModule() {
    this.moduleForm.value.department_id &&
      this.personalDataService
        .getList('teacher', this.moduleForm.value.department_id.toString())
        .subscribe((teachers) => {
          this.teacherData = teachers.data;
        });
  }

  changeDepartment() {
    this.teacherData = [];
    this.getTeacherForModule();
  }

  toggleModal() {
    this.moduleForm.reset();
    this.isVisible = true;
  }

  delete(id: any) {
    console.log(id);
  }

  search() {}

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    if (this.moduleForm.valid) {
      this.services
        .create(this.moduleForm.value)
        .pipe(
          map((res) => {
            if (res.data) {
              this.toast.open('Tạo thành công', 'success');
              this.getList();
              this.isVisible = false;
            } else {
              this.toast.open('Tạo lỗi (trùng mã)', 'error');
            }
          })
        )
        .subscribe();
    }
  }
}
