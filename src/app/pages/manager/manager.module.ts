import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerComponent } from './manager.component';
import { AntDesignModule } from '../../modules/ant-design/ant-design.module';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  declarations: [ManagerComponent],
  imports: [CommonModule, AntDesignModule, AppRoutingModule],
})
export class ManagerModule {}
