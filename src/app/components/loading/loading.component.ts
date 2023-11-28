import { Component } from '@angular/core';
import { LoadingService } from '../../interceptor/loading/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService, public router: Router) {}

  checkHome() {
    return this.router.url === '/login';
  }
}
