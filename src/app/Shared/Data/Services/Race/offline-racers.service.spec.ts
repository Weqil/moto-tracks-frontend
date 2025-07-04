import { TestBed } from '@angular/core/testing';

import { OfflineRacersService } from './offline-racers.service';

describe('OfflineRacersService', () => {
  let service: OfflineRacersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineRacersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
