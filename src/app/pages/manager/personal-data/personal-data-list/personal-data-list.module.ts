import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDataListComponent } from './personal-data-list.component';
import { AntDesignModule } from '../../../../modules/ant-design/ant-design.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PersonalDataListComponent],
  imports: [CommonModule, FormsModule, RouterModule, AntDesignModule],

  exports: [PersonalDataListComponent],
})
export class PersonalDataListModule {}
