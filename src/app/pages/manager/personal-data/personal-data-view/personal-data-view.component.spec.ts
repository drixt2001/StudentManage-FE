import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDataViewComponent } from './personal-data-view.component';

describe('PersonalDataViewComponent', () => {
  let component: PersonalDataViewComponent;
  let fixture: ComponentFixture<PersonalDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalDataViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
