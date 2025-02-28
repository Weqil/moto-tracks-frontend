import { TestBed } from '@angular/core/testing';

import { ComandsService } from './comands.service';

describe('ComandsService', () => {
  let service: ComandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
