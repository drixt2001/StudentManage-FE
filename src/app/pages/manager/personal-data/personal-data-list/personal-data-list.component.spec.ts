import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDataListComponent } from './personal-data-list.component';

describe('PersonalDataListComponent', () => {
  let component: PersonalDataListComponent;
  let fixture: ComponentFixture<PersonalDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDataListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
