import { Component, OnInit } from '@angular/core';
import { PersonalDataService } from '../personal-data.service';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-personal-data-list',
  templateUrl: './personal-data-list.component.html',
  styleUrls: ['./personal-data-list.component.scss'],
})
export class PersonalDataListComponent implements OnInit {
  constructor(private personalDataService: PersonalDataService) {}

  selectedRole!: string;
  selectedDepartment!: string;
  selectedClass!: string;
  nameValue!: string;

  personalData: any[] = [];

  ngOnInit(): void {
    this.selectedRole = 'teacher';
    this.getData();
  }

  search() {
    this.getData();
  }

  convertDate(date: string) {
    return dayjs(date).format('DD/MM/YYYY');
  }

  getData() {
    this.personalDataService.getList(this.selectedRole).subscribe((res) => {
      this.personalData = res.data;
    });
  }

  setData() {
    this.personalData = [];
    this.getData();
  }
}
