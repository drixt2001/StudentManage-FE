import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceRecognitionModule } from './pages/face-recognition/face-recognition.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, FaceRecognitionModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
