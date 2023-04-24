import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceRecognitionComponent } from './pages/face-recognition/face-recognition.component';
import { AppModule } from './app.module';
import { PersonalDataListComponent } from './pages/manager/personal-data/personal-data-list/personal-data-list.component';

const routes: Routes = [
  { path: 'face-recognition', component: FaceRecognitionComponent },
  {
    path: 'admin',
    children: [
      {
        path: 'canhan',
        component: PersonalDataListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
