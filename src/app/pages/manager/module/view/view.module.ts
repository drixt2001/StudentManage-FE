import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { AntDesignModule } from 'src/app/modules/ant-design/ant-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewComponent],
  imports: [CommonModule, AntDesignModule, ReactiveFormsModule, FormsModule],
})
export class ViewModule {}
