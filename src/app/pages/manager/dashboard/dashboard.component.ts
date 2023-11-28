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
  countChart: any;
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
    this.faceRecognitionService.activeClass.subscribe((val) => {
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
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    this.countChart = new Chart('countDelayChart', {
      type: 'bar',
      data: {
        labels: ['K53 THKT', 'K57 KTS', 'K53 TKKD', 'K55 PTDL'],
        datasets: [
          {
            label: 'Đi Muộn',
            data: [5, 3, 2, 1],
            backgroundColor: ['cadetBlue'],
            borderColor: 'cadetBlue',
          },
        ],
      },
      options: {
        indexAxis: 'x',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  //

  //
}
