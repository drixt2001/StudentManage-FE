import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AntDesignModule } from 'src/app/modules/ant-design/ant-design.module';

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,
    AntDesignModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
  exports: [ReportComponent],
})
export class ReportModule {}
