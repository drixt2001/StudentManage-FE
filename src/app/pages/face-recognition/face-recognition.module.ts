import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceRecognitionComponent } from './face-recognition.component';
import { HttpClientModule } from '@angular/common/http';
import { AntDesignModule } from 'src/app/modules/ant-design/ant-design.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FaceRecognitionComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AntDesignModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [FaceRecognitionComponent],
})
export class FaceRecognitionModule {}
