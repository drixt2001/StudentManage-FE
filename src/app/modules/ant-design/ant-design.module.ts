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
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

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
    NzAvatarModule,
    NzFormModule,
    NzUploadModule,
    NzModalModule,
    NzSkeletonModule,
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
    NzAvatarModule,
    NzFormModule,
    NzUploadModule,
    NzModalModule,
    NzSkeletonModule,
  ],
})
export class AntDesignModule {}
