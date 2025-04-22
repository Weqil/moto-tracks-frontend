import { TestBed } from '@angular/core/testing';

import { RegionModalsService } from './region-modals.service';

describe('RegionModalsService', () => {
  let service: RegionModalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionModalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
