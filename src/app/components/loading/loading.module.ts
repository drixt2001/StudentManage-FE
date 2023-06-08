import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { AntDesignModule } from '../../modules/ant-design/ant-design.module';

@NgModule({
  declarations: [LoadingComponent],
  imports: [CommonModule, AntDesignModule],
  exports: [LoadingComponent],
})
export class LoadingModule {}
