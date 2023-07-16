import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ToastService } from 'src/app/components/toast/toast.service';
import { PeriodService } from './period.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss'],
})
export class PeriodComponent {
  listOfData: any[] = [];
  isVisible = false;
  buttonTitle = 'Tạo kỳ tổ chức';

  PeriodForm = new FormGroup({
    id: new FormControl(),
    full_name: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
  });
  constructor(
    private periodService: PeriodService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.periodService.getList().subscribe((res) => {
      this.listOfData = res.data;
    });
  }

  handleCancel() {
    this.PeriodForm.reset();
    this.isVisible = false;
  }
  handleOk() {
    if (this.PeriodForm.valid) {
      if (this.checkValidInputDate()) {
        if (this.buttonTitle === 'Tạo kỳ tổ chức') {
          this.create();
          this.handleCancel();
        } else {
          this.update();
          this.handleCancel();
        }
      } else
        this.toast.open('Ngày bắt đầu phải trước ngày kết thúc', 'warning');
    } else {
      this.toast.open('Vui lòng nhập đầy đủ thông tin', 'warning');
    }
  }
  toggleModal(data: any) {
    if (data.id) {
      this.buttonTitle = 'Cập nhật';
      this.PeriodForm.controls['id'].setValue(data.id);
      this.PeriodForm.controls['full_name'].setValue(data.full_name);
      this.PeriodForm.controls['start'].setValue(data.start);
      this.PeriodForm.controls['end'].setValue(data.end);
    } else {
      this.buttonTitle = 'Tạo kỳ tổ chức';
    }
    this.isVisible = true;
  }

  getDayFormat(formDate: string) {
    return dayjs(formDate).format('YYYY-MM-DD');
  }
  checkValidInputDate(): boolean {
    if (
      this.getDayFormat(this.PeriodForm.value.start!) <
      this.getDayFormat(this.PeriodForm.value.end!)
    )
      return true;
    return false;
  }
  create() {
    const form = {
      full_name: this.PeriodForm.value.full_name!,
      start: this.getDayFormat(this.PeriodForm.value.start!),
      end: this.getDayFormat(this.PeriodForm.value.end!),
    };

    this.periodService
      .create(form)
      .pipe(
        map((res) => {
          if (res.data) {
            this.toast.open('Tạo thành công', 'success');
            this.getList();
          }
        })
      )
      .subscribe();
  }

  update() {
    const id = this.PeriodForm.value.id;
    const dto = {
      full_name: this.PeriodForm.value.full_name,
      start: this.getDayFormat(this.PeriodForm.value.start!),
      end: this.getDayFormat(this.PeriodForm.value.end!),
    };
    this.periodService
      .update(id, dto)
      .pipe(
        map((res) => {
          if (res.data) {
            this.toast.open('Cập nhật thành công', 'success');
            this.getList();
          }
        })
      )
      .subscribe();
  }

  delete(id: number) {
    this.periodService
      .delete(id)
      .pipe(
        map((res) => {
          this.getList();
          return this.toast.open('Xóa thành công!', 'success');
        })
      )
      .subscribe();
  }
}
