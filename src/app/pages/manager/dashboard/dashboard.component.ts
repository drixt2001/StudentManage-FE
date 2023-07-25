import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FaceRecognitionService } from '../../face-recognition/face-recognition.service';
import { ModuleService } from '../module/module.service';
import { Chart, registerables } from 'chart.js';
import * as dayjs from 'dayjs';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnDestroy, AfterViewInit {
  onlineClass = 0;
  totalClass = 0;
  myChart: any;
  listLabels: any[] = ['Start'];
  listCountClass: any[] = [0];

  constructor(
    private faceRecognitionService: FaceRecognitionService,
    private moduleService: ModuleService
  ) {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.initChart();

    this.faceRecognitionService.sendGet();
    this.faceRecognitionService.activeUsers$.subscribe((val) => {
      this.onlineClass = val;
      this.listLabels.push(dayjs().format('HH:mm:ss DD/MM/YYYY'));
      this.listCountClass.push(this.onlineClass);
      if (this.myChart) this.myChart.update();
    });
  }

  initChart() {
    this.myChart = new Chart('onlineClassChart', {
      type: 'line',
      data: {
        labels: this.listLabels,
        datasets: [
          {
            label: 'Số lớp',
            data: this.listCountClass,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0,
          },
        ],
      },
      options: {
        indexAxis: 'x',
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
