import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceRecognitionComponent } from './pages/face-recognition/face-recognition.component';
import { AppModule } from './app.module';
import { PersonalDataListComponent } from './pages/manager/personal-data/personal-data-list/personal-data-list.component';
import { PersonalDataViewComponent } from './pages/manager/personal-data/personal-data-view/personal-data-view.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { PeriodComponent } from './pages/manager/period/period.component';
import { ModuleComponent } from './pages/manager/module/module.component';
import { ViewComponent } from './pages/manager/module/view/view.component';
import { DashboardComponent } from './pages/manager/dashboard/dashboard.component';
import { ReportComponent } from './pages/manager/report/report.component';
import { ChildRoleGuard, RoleGuard } from './guard/role.guard';

const routes: Routes = [
  { path: 'face-recognition', component: FaceRecognitionComponent },
  {
    path: 'quanly',
    component: ManagerComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'canhan',
        component: PersonalDataListComponent,
      },
      {
        path: 'canhan/sua/:Id',
        component: PersonalDataViewComponent,
      },
      {
        path: 'canhan/tao',
        component: PersonalDataViewComponent,
      },
      {
        path: 'hocky',
        component: PeriodComponent,
      },
      {
        path: 'hocphan',
        component: ModuleComponent,
      },
      {
        path: 'hocphan/:id',
        component: ViewComponent,
      },
      {
        path: 'thongkebaocao',
        component: ReportComponent,
      },
    ],
    canActivate: [RoleGuard],
    canActivateChild: [ChildRoleGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'sinhvien',
    component: ManagerComponent,
    canActivate: [RoleGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
