import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceRecognitionComponent } from './pages/face-recognition/face-recognition.component';
import { AppModule } from './app.module';
import { PersonalDataListComponent } from './pages/manager/personal-data/personal-data-list/personal-data-list.component';
import { PersonalDataViewComponent } from './pages/manager/personal-data/personal-data-view/personal-data-view.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ManagerComponent } from './pages/manager/manager.component';

const routes: Routes = [
  { path: 'face-recognition', component: FaceRecognitionComponent },
  {
    path: 'quanly',
    component: ManagerComponent,
    children: [
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
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
