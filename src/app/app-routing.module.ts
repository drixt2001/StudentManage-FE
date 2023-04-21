import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceRecognitionComponent } from './pages/face-recognition/face-recognition.component';
import { AppModule } from './app.module';

const routes: Routes = [
  { path: 'face-recognition', component: FaceRecognitionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
