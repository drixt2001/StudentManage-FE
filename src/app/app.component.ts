import { Component, DoCheck, OnInit } from '@angular/core';
import { check, face } from './modules/face-api/face-api';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, DoCheck {
  title = 'Quản Lý Điểm Danh';
  canActive = false;
  percent = 0;
  token: string = '';

  constructor(private router: Router, private appService: AppService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    if (!this.token) {
      this.router.navigate(['/login']);
    } else {
    }
  }

  ngDoCheck(): void {
    if (!this.canActive) {
      this.appService.getFaceAPISuccess().subscribe((isSuccess) => {
        if (isSuccess) {
          this.percent = isSuccess;
          isSuccess === 100 && (this.canActive = true);
        }
      });
    }
  }

  checkHome() {
    return this.router.url === '/login';
  }
}
