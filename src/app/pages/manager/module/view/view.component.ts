import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/components/toast/toast.service';
import { LoadingService } from 'src/app/interceptor/loading/loading.service';
import { DepartmentService } from '../../department/department.service';
import { PersonalDataViewService } from '../../personal-data/personal-data-view/personal-data-view.service';
import { PersonalDataService } from '../../personal-data/personal-data.service';
import { ModuleService } from '../module.service';
import { PeriodService } from '../../period/period.service';
import { TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent {
  selectedTab: string = 'infos';
  moduleId?: string;
  $asTransferItems = (data: unknown): any[] => data as TransferItem[];

  departmentData: any[] = [];
  periodData: any[] = [];
  teacherData: any[] = [];
  studentList: any[] = [];
  listIdStudent: any[] = [];
  weektimes: any[] = [];
  initWeektimes: any[] = [];
  currentTime: any[] = [];

  moduleForm = new FormGroup({
    sid: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    period_id: new FormControl(0, [Validators.required]),
    department_id: new FormControl(0, [Validators.required]),
    teacher_id: new FormControl(0, [Validators.required]),
    credit: new FormControl(0, [Validators.required]),
    allow_leaving: new FormControl(0),
    allow_delay: new FormControl(0),
  });

  constructor(
    private service: ModuleService,
    private periodService: PeriodService,
    private departmentService: DepartmentService,
    public loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    private personalDataService: PersonalDataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.service.getWeekdays().subscribe((val) => {
      this.initWeektimes = val.data;
      this.weektimes = this.initWeektimes.map((weekdays: any) => {
        return { ...weekdays, checked: false, start: null, end: null };
      });
    });

    this.getListPeriod();
    this.getListDepartment();

    this.route.paramMap.subscribe((params) => {
      this.moduleId = params.get('id')!;
    });
    if (this.moduleId) {
      this.getModuleDetail(this.moduleId);
    }
  }

  changeTime() {
    this.currentTime = this.weektimes.filter(
      (val) => val.checked && val.start && val.end
    );
  }

  updateAllow() {
    this.service
      .updateAllow(this.moduleId!, {
        allow_delay: this.moduleForm.value.allow_delay,
        allow_leaving: this.moduleForm.value.allow_leaving,
      })
      .subscribe(() => {
        this.toast.open('Cập nhật điều kiện thành công', 'success');
        this.getSchedule();
      });
  }

  updateSchedule() {
    this.service
      .updateSchedule(this.moduleId!, this.currentTime)
      .subscribe(() => {
        this.toast.open('Cập nhật lịch học thành công', 'success');
        this.getSchedule();
      });
  }

  getSchedule() {
    this.service.getSchedule(this.moduleId!).subscribe((schedule) => {
      schedule.data.map((sc: any) => {
        this.weektimes.filter((v) => v.id === sc.weekday_id)[0].checked = true;
        this.weektimes.filter((v) => v.id === sc.weekday_id)[0].start =
          sc.start_on_day.substring(0, 5);
        this.weektimes.filter((v) => v.id === sc.weekday_id)[0].end =
          sc.end_on_day.substring(0, 5);
      });
    });
  }

  generateListTime(): any {
    let arr = [];
    for (let i = 6; i < 24; i++) {
      for (let j = 0; j < 60; j = j + 10) {
        if (i < 10) {
          if (j == 0) {
            arr.push(`0${i}:${j}0`);
          } else arr.push(`0${i}:${j}`);
        } else {
          if (j == 0) {
            arr.push(`${i}:${j}0`);
          } else arr.push(`${i}:${j}`);
        }
      }
    }
    return arr;
  }

  changeTab(tab: string) {
    this.selectedTab = tab;
  }

  changeDepartment() {
    this.teacherData = [];
    this.getTeacherForModule();
    this.moduleForm.controls.teacher_id.reset();
  }

  getModuleDetail(id: string) {
    id &&
      this.service.getOne(id).subscribe((module) => {
        this.moduleForm.patchValue(module.data);
        this.getTeacherForModule();

        this.listIdStudent =
          module.data.students?.map((val: any) => val.student_id) || [];
        this.getListStudent();
        this.getSchedule();
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

  getListStudent() {
    this.personalDataService.getList('student').subscribe((res) => {
      console.log(res);
      this.studentList = res.data.map((val: any) => {
        return {
          ...val,
          direction:
            this.listIdStudent.length &&
            this.listIdStudent.includes(val.student_id)
              ? 'right'
              : 'left',
        };
      });
    });
  }

  select(ret: any): void {}

  change(ret: any): void {
    const listKeys = ret.list.map((l: any) => l.key);
    const hasOwnKey = (e: any): boolean => e.hasOwnProperty('key');
    this.studentList = this.studentList.map((e) => {
      if (listKeys.includes(e.key) && hasOwnKey(e)) {
        if (ret.to === 'left') {
          delete e.hide;
        } else if (ret.to === 'right') {
          e.hide = false;
        }
      }
      return e;
    });
    console.log(ret);
    if (ret.from === 'left') {
      ret.list.map((item: any) => {
        this.service
          .addStudent({
            module_id: this.moduleId,
            student_id: item.student_id,
          })
          .subscribe();
      });
    } else {
      ret.list.map((item: any) => {
        this.service.deleteStudent(item.student_id).subscribe();
      });
    }
  }
}
