import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ToastService } from 'src/app/components/toast/toast.service';
import { DepartmentService } from '../department/department.service';
import { ModuleService } from '../module/module.service';
import { PeriodService } from '../period/period.service';
import { PersonalDataService } from '../personal-data/personal-data.service';
import { Chart } from 'chart.js';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent {
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

  countChart: any;
  countChart2: any;

  constructor(
    private services: ModuleService,
    public toast: ToastService,
    private departmentService: DepartmentService,
    private periodService: PeriodService,
    private personalDataService: PersonalDataService
  ) {}

  ngOnInit(): void {
    // this.getList();
    // this.getListDepartment();
    // this.getListPeriod();

    this.countChart = new Chart('countDelayChart', {
      type: 'bar',
      data: {
        labels: ['K53 THKT', 'K57 KTS', 'K53 TKKD', 'K55 PTDL'],
        datasets: [
          {
            label: 'Tổng Số Lần Đi Muộn Hôm Nay',
            data: [5, 3, 2, 1],
            backgroundColor: ['cadetBlue'],
            borderColor: 'cadetBlue',
          },
        ],
      },
      options: {
        indexAxis: 'x',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    this.countChart2 = new Chart('countDelayChart2', {
      type: 'bar',
      data: {
        labels: ['K53 THKT', 'K57 KTS', 'K53 TKKD', 'K55 PTDL'],
        datasets: [
          {
            label: 'Tổng Số Lần Đi Muộn Trong Học Kỳ',
            data: [9, 11, 13, 5],
            backgroundColor: ['#FFEC8B'],
            borderColor: '#FFEC8B',
          },
        ],
      },
      options: {
        indexAxis: 'x',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  getList() {
    this.personalDataService.getList('student').subscribe((res) => {
      this.listOfData = res.data
        .map((val: any) => {
          return {
            ...val,
            module: 'HTTT2133, THUD2233',
            leave: Math.floor(Math.random() * 5),
            rangeTime: 'Hôm nay',
          };
        })
        .sort((x: any, y: any) => y.leave - x.leave);
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
    // this.moduleForm.reset();
    // this.isVisible = true;
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

  export() {
    let element = document.getElementById('tablez');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    console.log(ws);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `ThongKe.xlsx`);
  }
}
