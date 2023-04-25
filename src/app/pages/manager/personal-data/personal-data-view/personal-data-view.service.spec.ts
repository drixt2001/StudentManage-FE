import { TestBed } from '@angular/core/testing';

import { PersonalDataViewService } from './personal-data-view.service';

describe('PersonalDataViewService', () => {
  let service: PersonalDataViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalDataViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
