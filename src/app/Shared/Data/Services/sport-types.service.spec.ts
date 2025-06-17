import { TestBed } from '@angular/core/testing';

import { SportTypesService } from './sport-types.service';

describe('SportTypesService', () => {
  let service: SportTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SportTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
