import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDataViewComponent } from './personal-data-view.component';
import { AntDesignModule } from '../../../../modules/ant-design/ant-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PersonalDataViewComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AntDesignModule],
  exports: [PersonalDataViewComponent],
})
export class PersonalDataViewModule {}
