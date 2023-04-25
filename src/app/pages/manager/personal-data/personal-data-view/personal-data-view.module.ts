import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDataViewComponent } from './personal-data-view.component';
import { AntDesignModule } from '../../../../modules/ant-design/ant-design.module';

@NgModule({
  declarations: [PersonalDataViewComponent],
  imports: [CommonModule, AntDesignModule],
  exports: [PersonalDataViewComponent],
})
export class PersonalDataViewModule {}
