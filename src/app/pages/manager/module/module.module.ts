import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleComponent } from './module.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AntDesignModule } from 'src/app/modules/ant-design/ant-design.module';

@NgModule({
  declarations: [ModuleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AntDesignModule,
    FormsModule,
  ],
})
export class ModuleModule {}
