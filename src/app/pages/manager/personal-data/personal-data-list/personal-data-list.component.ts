import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-data-list',
  templateUrl: './personal-data-list.component.html',
  styleUrls: ['./personal-data-list.component.scss'],
})
export class PersonalDataListComponent implements OnInit {
  selectedRole!: string;
  selectedDepartment!: string;
  selectedClass!: string;
  nameValue!: string;

  personalData: any[] = [];

  ngOnInit(): void {
    this.selectedRole = 'teacher';
    this.personalData = [
      {
        id: '19K4081028',
        name: 'Thang Le Dinh',
        birthday: '29/10/2001',
        department: 'HTTTKT',
        class: 'K53 THKT',
        pictures: 4,
      },
    ];
  }

  search() {
    const data = `Doi tuong: ${this.selectedRole} - Khoa: ${this.selectedDepartment} - Lop: ${this.selectedClass} - Ten: ${this.nameValue}`;
    alert(data);
  }
}
