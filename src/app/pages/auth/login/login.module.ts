import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../../../modules/ant-design/ant-design.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AntDesignModule],
})
export class LoginModule {}
