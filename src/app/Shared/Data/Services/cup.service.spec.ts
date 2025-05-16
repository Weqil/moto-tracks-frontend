import { TestBed } from '@angular/core/testing';

import { CupService } from './cup.service';

describe('CupService', () => {
  let service: CupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
