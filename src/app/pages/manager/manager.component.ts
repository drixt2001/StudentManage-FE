import { Component, OnInit } from '@angular/core';
import { FaceRecognitionService } from '../face-recognition/face-recognition.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LoginService } from '../auth/login/login.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
})
export class ManagerComponent implements OnInit {
  listBreadcrumms: any[] = [];

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.listBreadcrumms.push({ link: '/quanly', name: 'Trang Chủ' });
    this.router.events
      .pipe(filter((ev) => ev instanceof NavigationStart))
      .subscribe((event: any) => {
        if (
          event.url.includes('/quanly/canhan/sua') ||
          event.url.includes('/quanly/canhan/tao')
        ) {
          this.listBreadcrumms[1] = {
            link: '/quanly/canhan',
            name: 'Dữ Liệu Cá Nhân',
          };
        } else if (event.url.includes('/quanly/hocphan/')) {
          this.listBreadcrumms[1] = {
            link: '/quanly/hocphan',
            name: 'Quản Lý Học Phần',
          };
        } else if (this.listBreadcrumms[1]) {
          this.listBreadcrumms.pop();
        }
      });
  }

  logout() {
    this.loginService.logout();
  }
}
