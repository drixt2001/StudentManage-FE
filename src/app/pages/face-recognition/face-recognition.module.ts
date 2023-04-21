import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FaceRecognitionComponent } from "./face-recognition.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [FaceRecognitionComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [FaceRecognitionComponent],
})
export class FaceRecognitionModule {}
