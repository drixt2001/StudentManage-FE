import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzMenuModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzDividerModule,
  ],
  exports: [
    NzLayoutModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzMenuModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    NzDividerModule,
  ],
})
export class AntDesignModule {}
