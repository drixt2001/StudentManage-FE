import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceRecognitionModule } from './pages/face-recognition/face-recognition.module';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AntDesignModule } from './modules/ant-design/ant-design.module';
import { PersonalDataListModule } from './pages/manager/personal-data/personal-data-list/personal-data-list.module';
import { PersonalDataViewModule } from './pages/manager/personal-data/personal-data-view/personal-data-view.module';
import { LoadingModule } from './components/loading/loading.module';
import { LoadingInterceptor } from './interceptor/loading/loading.interceptor';
import { ManagerModule } from './pages/manager/manager.module';
import { LoginModule } from './pages/auth/login/login.module';
import { ApiInterceptor } from './interceptor/api/api.interceptor';

registerLocaleData(vi);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    // external
    AntDesignModule,

    // page
    LoginModule,
    LoadingModule,
    ManagerModule,
    FaceRecognitionModule,
    PersonalDataListModule,
    PersonalDataViewModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
