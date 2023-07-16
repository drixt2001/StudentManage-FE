import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodComponent } from './period.component';
import { AntDesignModule } from 'src/app/modules/ant-design/ant-design.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PeriodComponent],
  imports: [CommonModule, AntDesignModule, ReactiveFormsModule, RouterModule],
})
export class PeriodModule {}
